export class CreateUserDto {
  id: string | number;
  provider: string;
  email?: string;
  name?: string;
}
