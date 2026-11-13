import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/services/api_client.dart';
import 'package:front_mobile/src/services/auth_service.dart';
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
  bool _success = false;

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
      setState(() {
        _success = false;
        _message = 'As senhas não coincidem';
      });
      return;
    }
    setState(() {
      _loading = true;
      _message = null;
    });
    try {
      final msg = await _auth.register(
        nome: _nome.text.trim(),
        email: _email.text.trim(),
        senha: _senha.text,
        confirmarSenha: _confirmar.text,
      );
      setState(() {
        _success = true;
        _message = msg;
        _nome.clear();
        _email.clear();
        _senha.clear();
        _confirmar.clear();
      });
    } catch (e) {
      setState(() {
        _success = false;
        _message = '$e';
      });
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
              const Text('Criar conta', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
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
                Text(
                  _message!,
                  style: TextStyle(color: _success ? Colors.green : Colors.red),
                ),
              FilledButton(
                onPressed: _loading ? null : _submit,
                child: Text(_loading ? 'Cadastrando...' : 'Cadastrar'),
              ),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, AppRoutes.login),
                child: const Text('Já tenho conta'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
