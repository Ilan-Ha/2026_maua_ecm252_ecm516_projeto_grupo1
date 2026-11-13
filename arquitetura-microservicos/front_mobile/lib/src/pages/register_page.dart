import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/services/api_client.dart';
import 'package:front_mobile/src/services/auth_service.dart';
import 'package:front_mobile/src/state/session_scope.dart';
import 'package:front_mobile/src/theme/brand.dart';
import 'package:front_mobile/src/widgets/app_shell.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _auth = AuthService(ApiClient());
  final _nome = TextEditingController();
  final _email = TextEditingController();
  final _senha = TextEditingController();
  final _confirmar = TextEditingController();
  bool _loading = false;
  String? _message;

  @override
  void dispose() {
    _nome.dispose();
    _email.dispose();
    _senha.dispose();
    _confirmar.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_senha.text != _confirmar.text) {
      setState(() => _message = 'As senhas não coincidem');
      return;
    }
    setState(() {
      _loading = true;
      _message = null;
    });

    final nome = _nome.text.trim();
    final email = _email.text.trim();
    final senha = _senha.text;
    final confirmar = _confirmar.text;

    try {
      await _auth.register(
        nome: nome,
        email: email,
        senha: senha,
        confirmarSenha: confirmar,
      );

      // Login automático após cadastro bem-sucedido
      final user = await _auth.login(email: email, senha: senha);
      if (!mounted) return;
      await SessionScope.of(context).setUsuario(user);
      if (!mounted) return;

      AppShellNav.go(context, AppRoutes.home);
    } catch (e) {
      if (!mounted) return;
      setState(() => _message = '$e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Cadastro',
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const Text(
                'Criar conta',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Brand.greenDark,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _nome,
                decoration: const InputDecoration(
                  labelText: 'Nome',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _email,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _senha,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Senha',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _confirmar,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Confirmar senha',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              if (_message != null)
                Text(_message!, style: const TextStyle(color: Colors.red)),
              FilledButton(
                onPressed: _loading ? null : _submit,
                child: Text(_loading ? 'Cadastrando...' : 'Cadastrar'),
              ),
              TextButton(
                onPressed: () => AppShellNav.go(context, AppRoutes.login),
                child: const Text('Já tenho conta'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
