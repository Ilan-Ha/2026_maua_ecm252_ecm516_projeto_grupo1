import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/services/api_client.dart';
import 'package:front_mobile/src/services/auth_service.dart';
import 'package:front_mobile/src/state/session_scope.dart';
import 'package:front_mobile/src/widgets/app_shell.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final _auth = AuthService(ApiClient());
  final _nome = TextEditingController();
  final _email = TextEditingController();
  final _senha = TextEditingController();
  final _confirmar = TextEditingController();
  bool _hydrated = false;
  bool _loading = false;
  String? _message;
  bool _success = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_hydrated) return;
    final user = SessionScope.of(context).usuario;
    if (user != null) {
      _nome.text = user.nome;
      _email.text = user.email;
      _hydrated = true;
    }
  }

  @override
  void dispose() {
    _nome.dispose();
    _email.dispose();
    _senha.dispose();
    _confirmar.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_senha.text.isNotEmpty || _confirmar.text.isNotEmpty) {
      if (_senha.text != _confirmar.text) {
        setState(() {
          _success = false;
          _message = 'As senhas não coincidem';
        });
        return;
      }
      if (_senha.text.length < 8) {
        setState(() {
          _success = false;
          _message = 'A senha deve ter no mínimo 8 caracteres';
        });
        return;
      }
    }

    setState(() {
      _loading = true;
      _message = null;
    });
    try {
      final updated = await _auth.updateProfile(
        email: _email.text.trim(),
        nome: _nome.text.trim(),
        senha: _senha.text.isEmpty ? null : _senha.text,
      );
      if (!mounted) return;
      await SessionScope.of(context).setUsuario(updated);
      setState(() {
        _success = true;
        _message = 'Dados atualizados';
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
    final session = SessionScope.of(context);
    if (!session.isLoggedIn) {
      return AppShell(
        title: 'Perfil',
        body: Center(
          child: FilledButton(
            onPressed: () => Navigator.pushNamed(context, AppRoutes.login),
            child: const Text('Ir para login'),
          ),
        ),
      );
    }

    return AppShell(
      title: 'Perfil',
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const Text(
                'Meu perfil',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _email,
                enabled: false,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _nome,
                decoration: const InputDecoration(
                  labelText: 'Nome',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _senha,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Nova senha',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _confirmar,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Confirmar nova senha',
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
                onPressed: _loading ? null : _save,
                child: Text(_loading ? 'Salvando...' : 'Salvar alterações'),
              ),
              TextButton(
                onPressed: () async {
                  await session.logout();
                  if (!context.mounted) return;
                  Navigator.pushNamedAndRemoveUntil(
                    context,
                    AppRoutes.login,
                    (_) => false,
                  );
                },
                child: const Text('Sair'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
