import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuditLog } from '../common/logging/audit-log.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('cadastro')
  @AuditLog({ message: 'Cadastro de usuário', kind: 'manual' })
  cadastro(@Body() body: unknown) {
    return this.authService.cadastro(body);
  }

  @Post('login')
  @AuditLog({ message: 'Login de usuário', kind: 'manual' })
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
