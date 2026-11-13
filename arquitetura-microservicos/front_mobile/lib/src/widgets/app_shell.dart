import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/state/session_scope.dart';
import 'package:front_mobile/src/widgets/health_badge.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.title, required this.body});

  final String title;
  final Widget body;

  @override
  Widget build(BuildContext context) {
    final session = SessionScope.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset('assets/images/AllForOne_Logo.png', height: 32),
            const SizedBox(width: 8),
            Flexible(child: Text(title, overflow: TextOverflow.ellipsis)),
          ],
        ),
        actions: [
          const Padding(
            padding: EdgeInsets.only(right: 8),
            child: HealthBadge(),
          ),
          IconButton(
            tooltip: 'Catálogo',
            onPressed: () =>
                Navigator.pushNamedAndRemoveUntil(context, AppRoutes.home, (_) => false),
            icon: const Icon(Icons.storefront_outlined),
          ),
          IconButton(
            tooltip: 'Comparar',
            onPressed: () => Navigator.pushNamed(context, AppRoutes.compare),
            icon: const Icon(Icons.compare_arrows),
          ),
          IconButton(
            tooltip: 'Histórico',
            onPressed: () => Navigator.pushNamed(context, AppRoutes.history),
            icon: const Icon(Icons.history),
          ),
          IconButton(
            tooltip: session.isLoggedIn ? 'Perfil' : 'Login',
            onPressed: () => Navigator.pushNamed(
              context,
              session.isLoggedIn ? AppRoutes.profile : AppRoutes.login,
            ),
            icon: Icon(session.isLoggedIn ? Icons.person : Icons.login),
          ),
        ],
      ),
      body: SafeArea(child: body),
    );
  }
}
