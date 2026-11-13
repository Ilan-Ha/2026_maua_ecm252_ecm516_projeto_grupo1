import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/models/catalogo.dart';
import 'package:front_mobile/src/models/produto.dart';
import 'package:front_mobile/src/services/api_client.dart';
import 'package:front_mobile/src/services/catalog_service.dart';
import 'package:front_mobile/src/theme/brand.dart';
import 'package:front_mobile/src/widgets/app_shell.dart';
import 'package:front_mobile/src/widgets/network_image_view.dart';

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
    try {
      final prod = await _catalogService.getProduto(id);
      if (!mounted) return;
      setState(() => _detalhes[id] = prod);
    } catch (_) {}
  }

  List<String> get _selectedIds =>
      _colunas.where((id) => id.isNotEmpty).toList();

  List<String> get _specKeys {
    final keys = <String>{};
    for (final id in _selectedIds) {
      final p = _detalhes[id];
      if (p != null) keys.addAll(p.especificacoes.keys.map((e) => '$e'));
    }
    final list = keys.toList()..sort();
    return list;
  }

  double? get _minPrice {
    final prices = _selectedIds
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
                      key: ValueKey('categoria-$_categoria'),
                      value: _categoria,
                      decoration: const InputDecoration(
                        labelText: 'Categoria',
                        border: OutlineInputBorder(),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Brand.green, width: 2),
                        ),
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
                          : (_catalogo!.itens[_categoria!] ??
                              const <Produto>[]);
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          children: [
                            Expanded(
                              child: DropdownButtonFormField<String>(
                                key: ValueKey('prod-$index-${_colunas[index]}'),
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
                                        child: Text(
                                          p.nome,
                                          overflow: TextOverflow.ellipsis,
                                        ),
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
                                icon: const Icon(
                                  Icons.remove_circle_outline,
                                  color: Brand.greenDark,
                                ),
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
                    if (_selectedIds.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      _photoStrip(),
                      const SizedBox(height: 16),
                      _table(),
                    ],
                  ],
                ),
    );
  }

  Widget _photoStrip() {
    return SizedBox(
      height: 150,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _selectedIds.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (_, i) {
          final id = _selectedIds[i];
          final p = _detalhes[id];
          return InkWell(
            onTap: p == null
                ? null
                : () => Navigator.pushNamed(
                      context,
                      '${AppRoutes.product}/${p.id}',
                    ),
            borderRadius: BorderRadius.circular(12),
            child: Container(
              width: 120,
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Brand.greenMuted),
              ),
              child: Column(
                children: [
                  Expanded(
                    child: NetworkImageView(
                      url: p?.imagem,
                      width: 104,
                      height: 90,
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    p?.nome ?? '...',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _table() {
    final min = _minPrice;
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        headingRowColor: WidgetStateProperty.all(Brand.greenSoft),
        columns: [
          const DataColumn(label: Text('Atributo')),
          ..._selectedIds.map((id) {
            final p = _detalhes[id];
            return DataColumn(
              label: SizedBox(
                width: 110,
                child: Text(
                  p?.nome ?? '...',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            );
          }),
        ],
        rows: [
          DataRow(
            cells: [
              const DataCell(Text('Foto')),
              ..._selectedIds.map(
                (id) => DataCell(
                  NetworkImageView(
                    url: _detalhes[id]?.imagem,
                    width: 64,
                    height: 64,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
            ],
          ),
          DataRow(
            cells: [
              const DataCell(Text('Marca')),
              ..._selectedIds.map(
                (id) => DataCell(Text(_detalhes[id]?.marca ?? '-')),
              ),
            ],
          ),
          DataRow(
            cells: [
              const DataCell(Text('Lançamento')),
              ..._selectedIds.map(
                (id) => DataCell(Text('${_detalhes[id]?.lancamento ?? '-'}')),
              ),
            ],
          ),
          DataRow(
            cells: [
              const DataCell(Text('Preço médio')),
              ..._selectedIds.map((id) {
                final price = _detalhes[id]?.precoMedio;
                final highlight = price != null && min != null && price == min;
                return DataCell(
                  Text(
                    price == null ? '-' : 'R\$ ${price.toStringAsFixed(2)}',
                    style: TextStyle(
                      fontWeight:
                          highlight ? FontWeight.bold : FontWeight.normal,
                      color: highlight ? Brand.green : null,
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
                ..._selectedIds.map((id) {
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
