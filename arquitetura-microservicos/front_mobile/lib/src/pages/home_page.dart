import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/break_points.dart';
import 'package:front_mobile/src/models/catalogo.dart';
import 'package:front_mobile/src/models/categoria.dart';
import 'package:front_mobile/src/models/produto.dart';
import 'package:front_mobile/src/services/api_client.dart';
import 'package:front_mobile/src/services/catalog_service.dart';
import 'package:front_mobile/src/widgets/app_shell.dart';
import 'package:front_mobile/src/widgets/product_card.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _catalogService = CatalogService(ApiClient());
  Catalogo? _catalogo;
  String? _selectedTag;
  String _search = '';
  String? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
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

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Catálogo',
      body: RefreshIndicator(
        onRefresh: _load,
        child: LayoutBuilder(
          builder: (context, constraints) {
            final crossAxis = constraints.maxWidth > breakpointTablet
                ? 4
                : constraints.maxWidth > breakpointMobile
                    ? 3
                    : 2;
            return ListView(
              padding: const EdgeInsets.all(16),
              children: [
                const Text(
                  'CATEGORIAS DE PRODUTOS',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  'Explore especificações técnicas e detalhes por categoria',
                  style: TextStyle(color: Colors.grey.shade700),
                ),
                const SizedBox(height: 16),
                TextField(
                  decoration: const InputDecoration(
                    hintText: 'Buscar categoria',
                    prefixIcon: Icon(Icons.search),
                    border: OutlineInputBorder(),
                  ),
                  onChanged: (v) => setState(() => _search = v),
                ),
                const SizedBox(height: 16),
                if (_loading)
                  const Padding(
                    padding: EdgeInsets.all(32),
                    child: Center(child: CircularProgressIndicator()),
                  )
                else if (_error != null)
                  Text('Erro: $_error', style: const TextStyle(color: Colors.red))
                else if (_catalogo == null)
                  const Text('Catálogo vazio')
                else if (_selectedTag != null)
                  _productsGrid(crossAxis)
                else
                  _categoriesGrid(crossAxis),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _categoriesGrid(int crossAxis) {
    final filtered = _catalogo!.categorias
        .where((c) => c.nome.toLowerCase().contains(_search.toLowerCase()))
        .toList();
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: filtered.length,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxis,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 0.85,
      ),
      itemBuilder: (_, i) => _categoryCard(filtered[i]),
    );
  }

  Widget _categoryCard(Categoria cat) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => setState(() => _selectedTag = cat.tag),
        child: Column(
          children: [
            Expanded(
              child: Image.network(
                cat.imagem,
                fit: BoxFit.cover,
                width: double.infinity,
                errorBuilder: (_, __, ___) => const Icon(Icons.category),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Text(cat.nome, style: const TextStyle(fontWeight: FontWeight.w600)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _productsGrid(int crossAxis) {
    final items = _catalogo!.itens[_selectedTag!] ?? const <Produto>[];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextButton.icon(
          onPressed: () => setState(() => _selectedTag = null),
          icon: const Icon(Icons.arrow_back),
          label: Text('Voltar ($_selectedTag)'),
        ),
        const SizedBox(height: 8),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: items.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxis,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 0.75,
          ),
          itemBuilder: (_, i) => ProductCard(produto: items[i]),
        ),
      ],
    );
  }
}
