const { expect } = require('chai');
const sinon = require('sinon');

// Mock Prisma DB module before requiring controller
const prismaMock = {
  note: {
    findMany: () => {},
    findUnique: () => {},
    create: () => {},
    update: () => {},
    delete: () => {}
  }
};
require.cache[require.resolve('../../src/db')] = {
  id: require.resolve('../../src/db'),
  filename: require.resolve('../../src/db'),
  loaded: true,
  exports: prismaMock
};

const notesController = require('../../src/controllers/notes.controller');

describe('Notes Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { 
      body: {}, 
      params: {}, 
      user: { userId: 'user-1' } 
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createNote', () => {
    it('should return 400 if title or content is missing', async () => {
      req.body = { title: 'Missing Content' };
      
      await notesController.createNote(req, res, next);
      
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Title and content are required' })).to.be.true;
    });

    it('should create a note and return 201', async () => {
      req.body = { title: 'Test Note', content: 'Test Content' };
      const createdNote = { id: 'note-1', title: 'Test Note', content: 'Test Content', userId: 'user-1' };
      sinon.stub(prismaMock.note, 'create').resolves(createdNote);

      await notesController.createNote(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Note created successfully', note: createdNote })).to.be.true;
    });
  });

  describe('getNotes', () => {
    it('should fetch all notes for a user', async () => {
      const notesList = [{ id: 'note-1', title: 'Note 1' }, { id: 'note-2', title: 'Note 2' }];
      sinon.stub(prismaMock.note, 'findMany').resolves(notesList);

      await notesController.getNotes(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ notes: notesList })).to.be.true;
    });
  });

  describe('getNoteById', () => {
    it('should return 404 if note does not exist', async () => {
      req.params = { id: 'note-missing' };
      sinon.stub(prismaMock.note, 'findUnique').resolves(null);

      await notesController.getNoteById(req, res, next);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 403 if note belongs to another user', async () => {
      req.params = { id: 'note-1' };
      sinon.stub(prismaMock.note, 'findUnique').resolves({ id: 'note-1', userId: 'other-user' });

      await notesController.getNoteById(req, res, next);

      expect(res.status.calledWith(403)).to.be.true;
    });

    it('should return 200 and the note if it belongs to the user', async () => {
      req.params = { id: 'note-1' };
      const note = { id: 'note-1', userId: 'user-1' };
      sinon.stub(prismaMock.note, 'findUnique').resolves(note);

      await notesController.getNoteById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ note })).to.be.true;
    });
  });

  describe('updateNote', () => {
    it('should return 404 if note not found', async () => {
      req.params = { id: 'missing' };
      sinon.stub(prismaMock.note, 'findUnique').resolves(null);

      await notesController.updateNote(req, res, next);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 403 if updating another users note', async () => {
      req.params = { id: 'note-1' };
      sinon.stub(prismaMock.note, 'findUnique').resolves({ id: 'note-1', userId: 'other-user' });

      await notesController.updateNote(req, res, next);

      expect(res.status.calledWith(403)).to.be.true;
    });

    it('should return 200 on successful update', async () => {
      req.params = { id: 'note-1' };
      req.body = { title: 'Updated Title' };
      const existingNote = { id: 'note-1', userId: 'user-1' };
      const updatedNote = { id: 'note-1', title: 'Updated Title', userId: 'user-1' };
      
      sinon.stub(prismaMock.note, 'findUnique').resolves(existingNote);
      sinon.stub(prismaMock.note, 'update').resolves(updatedNote);

      await notesController.updateNote(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Note updated successfully', note: updatedNote })).to.be.true;
    });
  });

  describe('deleteNote', () => {
    it('should return 403 if deleting another users note', async () => {
      req.params = { id: 'note-1' };
      sinon.stub(prismaMock.note, 'findUnique').resolves({ id: 'note-1', userId: 'other-user' });

      await notesController.deleteNote(req, res, next);

      expect(res.status.calledWith(403)).to.be.true;
    });

    it('should return 200 on successful deletion', async () => {
      req.params = { id: 'note-1' };
      sinon.stub(prismaMock.note, 'findUnique').resolves({ id: 'note-1', userId: 'user-1' });
      sinon.stub(prismaMock.note, 'delete').resolves({});

      await notesController.deleteNote(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Note deleted successfully' })).to.be.true;
    });
  });
});
