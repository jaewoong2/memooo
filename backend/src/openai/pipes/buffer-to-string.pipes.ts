import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class BufferToStringPipe implements PipeTransform {
  transform(value: any) {
    // console.log(value);
    if (Buffer.isBuffer(value)) {
      const strValue = value.toString();
      try {
        // JSON 파싱 시도
        return JSON.parse(strValue);
      } catch (error) {
        throw new BadRequestException('Invalid JSON format');
      }
    }
    return value;
  }
}
