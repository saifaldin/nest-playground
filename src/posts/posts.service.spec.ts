import { Test } from '@nestjs/testing';
import { OptionsRepository } from '../options/options.repository';
import { OptionsModule } from '../options/options.module';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

const mockPostsRepository = () => ({
  getPosts: jest.fn(),
});

const mockOptionsRepository = () => ({});

describe('Posts service', () => {
  let postsService: PostsService;
  let postsRepository;

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
  });
  describe('get posts', () => {
    it('gets all posts', () => {
      expect(postsRepository.getPosts).not.toHaveBeenCalled();
    });
  });
});
