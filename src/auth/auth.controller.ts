import { Controller, Get, Body, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpAdminDto } from './dto/sign-up-admin.dto';
import { SignInAdminDto } from './dto/sign-in-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin')
  adminSignUp(@Body() body: SignUpAdminDto): Promise<string> {
    return this.authService.signUpAdmin(body);
  }

  @Get('admin')
  adminSignIn(
    @Query('email') email: string,
    @Query('password') password: string,
  ): Promise<string> {
    const signInAdminDto: SignInAdminDto = { email, password };
    return this.authService.signInAdmin(signInAdminDto);
  }

  @Post()
  async signIn(@Body() body: SignInDto): Promise<string> {
    const oauthUser = await this.authService.getOAuthUserData(
      body.provider,
      body.token,
    );

    return this.authService.signIn(oauthUser);
  }
}
