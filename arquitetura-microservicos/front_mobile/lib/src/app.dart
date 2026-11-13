import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/navigation/app_transitions.dart';
import 'package:front_mobile/src/pages/compare_page.dart';
import 'package:front_mobile/src/pages/history_page.dart';
import 'package:front_mobile/src/pages/home_page.dart';
import 'package:front_mobile/src/pages/login_page.dart';
import 'package:front_mobile/src/pages/product_page.dart';
import 'package:front_mobile/src/pages/profile_page.dart';
import 'package:front_mobile/src/pages/register_page.dart';
import 'package:front_mobile/src/theme/brand.dart';
import 'package:front_mobile/src/widgets/app_shell.dart';

class App extends StatelessWidget {
  const App({super.key});

  Widget _section(String route) {
    switch (route) {
      case AppRoutes.compare:
        return const ComparePage();
      case AppRoutes.history:
        return const HistoryPage();
      case AppRoutes.login:
        return const LoginPage();
      case AppRoutes.register:
        return const RegisterPage();
      case AppRoutes.profile:
        return const ProfilePage();
      case AppRoutes.home:
      default:
        return const HomePage();
    }
  }

  @override
  Widget build(BuildContext context) {
    AppShellNav.sectionBuilder = _section;

    return MaterialApp(
      title: 'AllForOne',
      theme: Brand.theme(),
      initialRoute: AppRoutes.home,
      onGenerateRoute: (settings) {
        final name = settings.name ?? AppRoutes.home;
        if (name.startsWith('${AppRoutes.product}/')) {
          final id = name.substring('${AppRoutes.product}/'.length);
          return softScaleRoute(
            ProductPage(productId: id),
            settings: settings,
          );
        }
        return fadeRoute(
          _section(name),
          settings: settings,
        );
      },
    );
  }
}
