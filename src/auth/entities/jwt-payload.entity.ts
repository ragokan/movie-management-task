import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class JwtPayload {
  @ApiProperty({ description: 'The id of the user' })
  sub: number;

  constructor(data: { sub: number }) {
    this.sub = data.sub;
  }

  @ApiHideProperty()
  public toPlainObject() {
    return { sub: this.sub };
  }
}
