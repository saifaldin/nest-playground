import { Test } from '@nestjs/testing';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

const mockPostsRepository = () => {
  getPosts: jest.fn();
};

describe('Posts service', () => {
  let postsService: PostsService;
  let postsRepository: PostsRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useFactory: mockPostsRepository,
        },
      ],
    }).compile();
    postsService = module.get<PostsService>(PostsService);
    postsRepository = module.get<PostsRepository>(PostsRepository);
  });
  describe('get posts', () => {
    it('gets all posts', () => {
      expect(postsRepository.getPosts).not.toHaveBeenCalled();
    });
  });
});
