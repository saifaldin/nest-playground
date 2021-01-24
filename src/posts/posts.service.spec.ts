import { Test } from '@nestjs/testing';
import { OptionsRepository } from '../options/options.repository';
import { Users } from '../users/users.entity';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

const mockPostsRepository = () => ({
  getPosts: jest.fn(),
  createPost: jest.fn(),
});

const mockOptionsRepository = () => ({
  createOptions: jest.fn(),
});

const mockUser = {
  id: 1,
  email: 'test@foo.com',
  name: 'test',
};

describe('- Posts service ', () => {
  let postsService;
  let postsRepository;
  let optionsRepository;

  beforeEach(async () => {
    // Posts Module
    const module = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useFactory: mockPostsRepository,
        },
        {
          provide: OptionsRepository,
          useFactory: mockOptionsRepository,
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postsRepository = module.get<PostsRepository>(PostsRepository);
    optionsRepository = module.get<OptionsRepository>(OptionsRepository);
  });
  describe('- Get one or multiple posts', () => {
    const mockPost = { id: 1, title: 'mock-post' };
    it('- Gets all posts', async () => {
      postsRepository.getPosts.mockResolvedValue([mockPost]);

      expect(postsRepository.getPosts).not.toHaveBeenCalled();

      const allPosts = await postsService.getPosts();
      expect(postsRepository.getPosts).toHaveBeenCalled();
      expect(allPosts).toEqual([mockPost]);
    });

    it('- Gets one post by id', async () => {
      postsRepository.getPosts.mockResolvedValue(mockPost);

      const onePost = await postsService.getPosts(1);
      expect(postsRepository.getPosts).toHaveBeenCalledWith(1);
      expect(onePost).toEqual(mockPost);
    });

    it("- Throws not found exception for not found, or invalid id's", async () => {
      postsRepository.getPosts.mockResolvedValue(null);

      expect(postsService.getPosts(99999)).rejects.toThrow(NotFoundException);
    });
  });
  describe('- Create new post', () => {
    const createPostDto: CreatePostDto = {
      caption: 'test-post',
      isHidden: false,
      options: ['option1'],
    };
    const mockNewOption = [
      {
        id: 1,
        title: 'option1',
      },
    ];
    const mockNewPost = {
      id: 1,
      caption: 'test-post',
      options: mockNewOption,
    };
    it('- Create new post with given parameters', async () => {
      optionsRepository.createOptions.mockResolvedValue(mockNewOption);
      postsRepository.createPost.mockResolvedValue(mockNewPost);

      expect(optionsRepository.createOptions).not.toHaveBeenCalled();
      expect(postsRepository.createPost).not.toHaveBeenCalled();

      const newPost = await postsService.createPost(createPostDto, mockUser);

      expect(optionsRepository.createOptions).toHaveBeenCalledWith(
        createPostDto.options,
      );
      expect(postsRepository.createPost).toHaveBeenCalledWith(
        createPostDto,
        mockUser,
        mockNewOption,
      );
      expect(newPost).toEqual(mockNewPost);
    });
  });
});
