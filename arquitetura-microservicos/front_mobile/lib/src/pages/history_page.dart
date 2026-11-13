import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/services/history_service.dart';
import 'package:front_mobile/src/widgets/app_shell.dart';

class HistoryPage extends StatefulWidget {
  const HistoryPage({super.key});

  @override
  State<HistoryPage> createState() => _HistoryPageState();
}

class _HistoryPageState extends State<HistoryPage> {
  final _history = HistoryService();
  List<Map<String, dynamic>> _items = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final items = await _history.load();
    if (!mounted) return;
    setState(() {
      _items = items;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Histórico',
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Produtos visualizados neste dispositivo',
                          style: TextStyle(fontWeight: FontWeight.w600),
                        ),
                      ),
                      TextButton(
                        onPressed: _items.isEmpty
                            ? null
                            : () async {
                                await _history.clear();
                                await _load();
                              },
                        child: const Text('Limpar'),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: _items.isEmpty
                      ? const Center(child: Text('Nenhum produto no histórico'))
                      : ListView.builder(
                          itemCount: _items.length,
                          itemBuilder: (_, i) {
                            final item = _items[i];
                            return ListTile(
                              leading: item['imagem'] == null ||
                                      '${item['imagem']}'.isEmpty
                                  ? const Icon(Icons.image)
                                  : Image.network(
                                      '${item['imagem']}',
                                      width: 48,
                                      height: 48,
                                      fit: BoxFit.cover,
                                      errorBuilder: (_, __, ___) =>
                                          const Icon(Icons.broken_image),
                                    ),
                              title: Text('${item['nome'] ?? ''}'),
                              subtitle: Text(
                                '${item['marca'] ?? ''} · R\$ ${(item['precoMedio'] as num?)?.toStringAsFixed(2) ?? '0.00'}',
                              ),
                              onTap: () => Navigator.pushNamed(
                                context,
                                '${AppRoutes.product}/${item['_id']}',
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
    );
  }
}
