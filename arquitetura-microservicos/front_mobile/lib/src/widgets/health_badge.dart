import 'dart:async';

import 'package:flutter/material.dart';
import 'package:front_mobile/src/services/api_client.dart';
import 'package:front_mobile/src/services/health_service.dart';

class HealthBadge extends StatefulWidget {
  const HealthBadge({super.key});

  @override
  State<HealthBadge> createState() => _HealthBadgeState();
}

class _HealthBadgeState extends State<HealthBadge> {
  final _service = HealthService(ApiClient());
  bool backend = false;
  bool db = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _refresh();
    _timer = Timer.periodic(const Duration(seconds: 5), (_) => _refresh());
  }

  Future<void> _refresh() async {
    final status = await _service.check();
    if (!mounted) return;
    setState(() {
      backend = status.backend;
      db = status.db;
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _dot(backend, 'API'),
        const SizedBox(width: 6),
        _dot(db, 'DB'),
      ],
    );
  }

  Widget _dot(bool ok, String label) {
    return Tooltip(
      message: '$label: ${ok ? 'ok' : 'offline'}',
      child: Container(
        width: 10,
        height: 10,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: ok ? Colors.green : Colors.redAccent,
        ),
      ),
    );
  }
}
