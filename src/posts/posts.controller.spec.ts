import { Test } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

const mockPostsService = () => ({
  getPosts: jest.fn(),
  createPost: jest.fn(),
});

const mockUser = {
  id: 1,
  email: 'test@foo.com',
  name: 'test',
};

describe('- Posts Controller', () => {
  let postsController;
  let postsService;

  beforeEach(async () => {
    // Posts Module
    const module = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useFactory: mockPostsService }],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postsController = module.get<PostsController>(PostsController);
  });
  describe('- Get one or multiple posts ', () => {
    it('- Get multiple posts', () => {
      postsService.getPosts.mockReturnValue('test');
      expect(postsService.getPosts).not.toHaveBeenCalled();
      const testReturn = postsController.getPosts();
      expect(postsService.getPosts).toHaveBeenCalledWith();
      expect(testReturn).toEqual('test');
    });
    it('- Get one post by id', () => {
      postsService.getPosts.mockReturnValue('test');
      expect(postsService.getPosts).not.toHaveBeenCalled();
      const testReturn = postsController.getOnePost(1);
      expect(postsService.getPosts).toHaveBeenCalledWith(1);
      expect(testReturn).toEqual('test');
    });
  });
  describe('- Create post with text or image options', () => {
    const mockCreatePostDto = {};
    it('Create post with images as options', () => {});
  });
});
