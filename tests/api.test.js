const request = require('supertest');
const { app } = require('../src/server/index');

describe('API Endpoints', () => {
  let token;
  
  beforeAll(async () => {
    // Register a test user
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com'
      });
    
    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    
    token = res.body.token;
  });
  
  describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          password: 'password123',
          email: 'newuser@example.com'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('username', 'newuser');
    });
    
    it('should login existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
    });
  });
  
  describe('Files Endpoints', () => {
    let fileId;
    
    it('should create a new file', async () => {
      const res = await request(app)
        .post('/api/files')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test File',
          content: '# Test Content'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', 'Test File');
      fileId = res.body.id;
    });
    
    it('should get all files', async () => {
      const res = await request(app)
        .get('/api/files')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
    
    it('should get a single file', async () => {
      const res = await request(app)
        .get(`/api/files/${fileId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', fileId);
    });
    
    it('should update a file', async () => {
      const res = await request(app)
        .put(`/api/files/${fileId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Test File',
          content: '# Updated Content'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'File updated successfully');
    });
    
    it('should delete a file', async () => {
      const res = await request(app)
        .delete(`/api/files/${fileId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'File deleted successfully');
    });
  });
  
  describe('Search Endpoint', () => {
    it('should search files', async () => {
      const res = await request(app)
        .get('/api/search?query=test')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});