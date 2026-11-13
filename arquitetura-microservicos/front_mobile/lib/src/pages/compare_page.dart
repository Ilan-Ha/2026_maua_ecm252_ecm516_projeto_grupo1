import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/models/catalogo.dart';
import 'package:front_mobile/src/models/produto.dart';
import 'package:front_mobile/src/services/api_client.dart';
import 'package:front_mobile/src/services/catalog_service.dart';
import 'package:front_mobile/src/widgets/app_shell.dart';

class ComparePage extends StatefulWidget {
  const ComparePage({super.key});

  @override
  State<ComparePage> createState() => _ComparePageState();
}

class _ComparePageState extends State<ComparePage> {
  final _catalogService = CatalogService(ApiClient());
  Catalogo? _catalogo;
  String? _categoria;
  List<String> _colunas = ['', ''];
  final Map<String, Produto> _detalhes = {};
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await _catalogService.getCatalogo();
      if (!mounted) return;
      setState(() {
        _catalogo = data;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = '$e';
        _loading = false;
      });
    }
  }

  Future<void> _ensureProduto(String id) async {
    if (id.isEmpty || _detalhes.containsKey(id)) return;
    final prod = await _catalogService.getProduto(id);
    if (!mounted) return;
    setState(() => _detalhes[id] = prod);
  }

  List<String> get _specKeys {
    final keys = <String>{};
    for (final id in _colunas) {
      final p = _detalhes[id];
      if (p != null) keys.addAll(p.especificacoes.keys.map((e) => '$e'));
    }
    final list = keys.toList()..sort();
    return list;
  }

  double? get _minPrice {
    final prices = _colunas
        .map((id) => _detalhes[id]?.precoMedio)
        .whereType<double>()
        .toList();
    if (prices.isEmpty) return null;
    return prices.reduce((a, b) => a < b ? a : b);
  }

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Comparar',
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text(_error!))
              : ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    DropdownButtonFormField<String>(
                      value: _categoria,
                      decoration: const InputDecoration(
                        labelText: 'Categoria',
                        border: OutlineInputBorder(),
                      ),
                      items: (_catalogo?.categorias ?? [])
                          .map(
                            (c) => DropdownMenuItem(
                              value: c.tag,
                              child: Text(c.nome),
                            ),
                          )
                          .toList(),
                      onChanged: (v) {
                        setState(() {
                          _categoria = v;
                          _colunas = ['', ''];
                          _detalhes.clear();
                        });
                      },
                    ),
                    const SizedBox(height: 12),
                    ...List.generate(_colunas.length, (index) {
                      final products = _categoria == null
                          ? const <Produto>[]
                          : (_catalogo!.itens[_categoria!] ?? const <Produto>[]);
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          children: [
                            Expanded(
                              child: DropdownButtonFormField<String>(
                                value: _colunas[index].isEmpty
                                    ? null
                                    : _colunas[index],
                                decoration: InputDecoration(
                                  labelText: 'Produto ${index + 1}',
                                  border: const OutlineInputBorder(),
                                ),
                                items: products
                                    .map(
                                      (p) => DropdownMenuItem(
                                        value: p.id,
                                        child: Text(p.nome),
                                      ),
                                    )
                                    .toList(),
                                onChanged: (id) async {
                                  setState(() => _colunas[index] = id ?? '');
                                  if (id != null) await _ensureProduto(id);
                                },
                              ),
                            ),
                            if (_colunas.length > 2)
                              IconButton(
                                onPressed: () => setState(() {
                                  _colunas.removeAt(index);
                                }),
                                icon: const Icon(Icons.remove_circle_outline),
                              ),
                          ],
                        ),
                      );
                    }),
                    TextButton.icon(
                      onPressed: () => setState(() => _colunas.add('')),
                      icon: const Icon(Icons.add),
                      label: const Text('Adicionar coluna'),
                    ),
                    const SizedBox(height: 16),
                    if (_colunas.any((id) => id.isNotEmpty)) _table(),
                  ],
                ),
    );
  }

  Widget _table() {
    final min = _minPrice;
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        columns: [
          const DataColumn(label: Text('Atributo')),
          ..._colunas.where((id) => id.isNotEmpty).map((id) {
            final p = _detalhes[id];
            return DataColumn(
              label: InkWell(
                onTap: p == null
                    ? null
                    : () => Navigator.pushNamed(
                          context,
                          '${AppRoutes.product}/${p.id}',
                        ),
                child: Text(p?.nome ?? '...'),
              ),
            );
          }),
        ],
        rows: [
          DataRow(
            cells: [
              const DataCell(Text('Marca')),
              ..._colunas.where((id) => id.isNotEmpty).map(
                    (id) => DataCell(Text(_detalhes[id]?.marca ?? '-')),
                  ),
            ],
          ),
          DataRow(
            cells: [
              const DataCell(Text('Lançamento')),
              ..._colunas.where((id) => id.isNotEmpty).map(
                    (id) => DataCell(
                      Text('${_detalhes[id]?.lancamento ?? '-'}'),
                    ),
                  ),
            ],
          ),
          DataRow(
            cells: [
              const DataCell(Text('Preço médio')),
              ..._colunas.where((id) => id.isNotEmpty).map((id) {
                final price = _detalhes[id]?.precoMedio;
                final highlight = price != null && min != null && price == min;
                return DataCell(
                  Text(
                    price == null ? '-' : 'R\$ ${price.toStringAsFixed(2)}',
                    style: TextStyle(
                      fontWeight:
                          highlight ? FontWeight.bold : FontWeight.normal,
                      color: highlight ? const Color(0xFF377F3F) : null,
                    ),
                  ),
                );
              }),
            ],
          ),
          ..._specKeys.map(
            (key) => DataRow(
              cells: [
                DataCell(Text(key)),
                ..._colunas.where((id) => id.isNotEmpty).map((id) {
                  final value = _detalhes[id]?.especificacoes[key];
                  return DataCell(Text(_format(value)));
                }),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _format(dynamic value) {
    if (value == null) return '-';
    if (value is bool) return value ? 'Sim' : 'Não';
    return '$value';
  }
}
