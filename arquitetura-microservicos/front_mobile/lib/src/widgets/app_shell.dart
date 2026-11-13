import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/navigation/app_transitions.dart';
import 'package:front_mobile/src/state/session_scope.dart';
import 'package:front_mobile/src/theme/brand.dart';
import 'package:front_mobile/src/widgets/health_badge.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.title, required this.body});

  final String title;
  final Widget body;

  @override
  Widget build(BuildContext context) {
    final session = SessionScope.of(context);
    final current = ModalRoute.of(context)?.settings.name ?? AppRoutes.home;
    final narrow = MediaQuery.sizeOf(context).width < 420;

    return Scaffold(
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(narrow ? 96 : 108),
        child: Material(
          color: Brand.greenSoft,
          child: SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 6, 12, 8),
              child: Column(
                children: [
                  Row(
                    children: [
                      Image.asset(
                        'assets/images/AllForOne_Logo.png',
                        height: 28,
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Brand.greenDark,
                          ),
                        ),
                      ),
                      const HealthBadge(),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _NavChip(
                        icon: Icons.storefront_outlined,
                        label: 'Catálogo',
                        showLabel: !narrow,
                        selected: current == AppRoutes.home,
                        onTap: () => AppShellNav.go(context, AppRoutes.home),
                      ),
                      _NavChip(
                        icon: Icons.compare_arrows,
                        label: 'Comparar',
                        showLabel: !narrow,
                        selected: current == AppRoutes.compare,
                        onTap: () => AppShellNav.go(context, AppRoutes.compare),
                      ),
                      _NavChip(
                        icon: Icons.history,
                        label: 'Histórico',
                        showLabel: !narrow,
                        selected: current == AppRoutes.history,
                        onTap: () => AppShellNav.go(context, AppRoutes.history),
                      ),
                      _NavChip(
                        icon: session.isLoggedIn ? Icons.person : Icons.login,
                        label: session.isLoggedIn ? 'Perfil' : 'Login',
                        showLabel: !narrow,
                        selected: current == AppRoutes.profile ||
                            current == AppRoutes.login,
                        onTap: () => AppShellNav.go(
                          context,
                          session.isLoggedIn
                              ? AppRoutes.profile
                              : AppRoutes.login,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: SafeArea(child: body),
    );
  }
}

class AppShellNav {
  static Widget Function(String route)? sectionBuilder;

  static void go(BuildContext context, String route) {
    final current = ModalRoute.of(context)?.settings.name;
    if (current == route) return;
    final builder = sectionBuilder;
    if (builder == null) {
      Navigator.pushNamedAndRemoveUntil(context, route, (_) => false);
      return;
    }
    Navigator.of(context).pushAndRemoveUntil(
      fadeRoute(builder(route), settings: RouteSettings(name: route)),
      (_) => false,
    );
  }
}

class _NavChip extends StatelessWidget {
  const _NavChip({
    required this.icon,
    required this.label,
    required this.selected,
    required this.onTap,
    this.showLabel = true,
  });

  final IconData icon;
  final String label;
  final bool selected;
  final bool showLabel;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: label,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          curve: Curves.easeOut,
          padding: EdgeInsets.symmetric(
            horizontal: showLabel ? 10 : 12,
            vertical: 6,
          ),
          decoration: BoxDecoration(
            color: selected ? Brand.green : Colors.transparent,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 18,
                color: selected ? Colors.white : Brand.greenDark,
              ),
              if (showLabel) ...[
                const SizedBox(width: 4),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: selected ? Colors.white : Brand.greenDark,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
