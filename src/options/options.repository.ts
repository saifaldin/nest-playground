import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { OptionType } from './option-type.enum';
import { Options } from './options.entity';

@EntityRepository(Options)
export class OptionsRepository extends Repository<Options> {
  async createOptions(
    options: (string | Express.Multer.File)[],
  ): Promise<Options[]> {
    const newOptions: Options[] = [];
    for (const option of options) {
      let newOption: Options;

      if (typeof option === 'string')
        newOption = new Options(OptionType.TEXT, option);
      else {
        const isCloudinary = option.path.includes('cloudinary');
        newOption = new Options(
          OptionType.FILE,
          option.filename,
          option.path,
          isCloudinary ? 'cloudinary' : 'minio',
        );
      }

      newOption = await newOption.save();
      newOptions.push(newOption); // Array of the saved entities
    }

    return newOptions;
  }

  async upvoteOption(option: Options) {
    option.votes++;
    option.save();

    return option;
  }
}
