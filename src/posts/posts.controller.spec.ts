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
      const result = postsController.getPosts();
      expect(postsService.getPosts).toHaveBeenCalledWith();
      expect(result).toEqual('test');
    });
    it('- Get one post by id', () => {
      postsService.getPosts.mockReturnValue('test');
      expect(postsService.getPosts).not.toHaveBeenCalled();
      const result = postsController.getOnePost(1);
      expect(postsService.getPosts).toHaveBeenCalledWith(1);
      expect(result).toEqual('test');
    });
  });
  describe('- Create post with text or image options', () => {
    const mockCreatePostDto = { options: [] };
    it('- Create post with images as options', () => {
      const mockFilesOption = ['files'];
      const mockText = ['text'];
      postsService.createPost.mockReturnValue('test');
      expect(postsService.createPost).not.toHaveBeenCalled();
      const result = postsController.createPost(
        mockText,
        mockFilesOption,
        mockCreatePostDto,
        mockUser,
      );
      expect(mockCreatePostDto.options).toEqual(mockFilesOption);
      expect(postsService.createPost).toHaveBeenCalledWith(
        mockCreatePostDto,
        mockUser,
      );
      expect(result).toEqual('test');
    });
    it('- Create post with text as options', () => {
      const mockFilesOptions = [];
      const mockText = ['text'];
      postsService.createPost.mockReturnValue('test');
      expect(postsService.createPost).not.toHaveBeenCalled();
      const result = postsController.createPost(
        mockText,
        mockFilesOptions,
        mockCreatePostDto,
        mockUser,
      );
      expect(mockCreatePostDto.options).toEqual(mockText);
      expect(postsService.createPost).toHaveBeenCalledWith(
        mockCreatePostDto,
        mockUser,
      );
      expect(result).toEqual('test');
    });
  });
});
