import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('cadastro')
  cadastro(@Body() body: unknown) {
    return this.authService.cadastro(body);
  }

  @Post('login')
  login(@Body() body: unknown) {
    return this.authService.login(body);
  }

  @Post('auth/refresh')
  refresh(@Body() body: unknown) {
    return this.authService.refresh(body);
  }

  @Post('auth/logout')
  logout(@Body() body: unknown) {
    return this.authService.logout(body);
  }

  @Post('perfil/atualizar/senha')
  atualizarSenha(@Body() body: unknown) {
    return this.authService.atualizarSenha(body);
  }
}
