import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/models/produto.dart';
import 'package:front_mobile/src/models/review.dart';
import 'package:front_mobile/src/services/api_client.dart';
import 'package:front_mobile/src/services/catalog_service.dart';
import 'package:front_mobile/src/services/history_service.dart';
import 'package:front_mobile/src/services/review_service.dart';
import 'package:front_mobile/src/state/session_scope.dart';
import 'package:front_mobile/src/widgets/app_shell.dart';

class ProductPage extends StatefulWidget {
  const ProductPage({super.key, required this.productId});

  final String productId;

  @override
  State<ProductPage> createState() => _ProductPageState();
}

class _ProductPageState extends State<ProductPage> {
  final _catalog = CatalogService(ApiClient());
  final _reviews = ReviewService(ApiClient());
  final _history = HistoryService();

  Produto? _produto;
  ReviewsPayload? _reviewData;
  String? _error;
  bool _loading = true;
  bool _sending = false;
  int _estrelas = 5;
  final _comentario = TextEditingController();
  String? _reviewMsg;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _comentario.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final produto = await _catalog.getProduto(widget.productId);
      await _history.registerAccess(produto.toHistoryJson());
      ReviewsPayload reviews;
      try {
        reviews = await _reviews.listByProduct(widget.productId);
      } catch (_) {
        reviews = const ReviewsPayload(mediaEstrelas: 0, total: 0, reviews: []);
      }
      if (!mounted) return;
      setState(() {
        _produto = produto;
        _reviewData = reviews;
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

  Future<void> _submitReview() async {
    final session = SessionScope.of(context);
    final user = session.usuario;
    if (user == null) {
      Navigator.pushNamed(context, AppRoutes.login);
      return;
    }
    setState(() {
      _sending = true;
      _reviewMsg = null;
    });
    try {
      final msg = await _reviews.create(
        produtoId: widget.productId,
        email: user.email,
        nome: user.nome,
        estrelas: _estrelas,
        comentario: _comentario.text.trim(),
      );
      final refreshed = await _reviews.listByProduct(widget.productId);
      if (!mounted) return;
      setState(() {
        _reviewMsg = msg;
        _reviewData = refreshed;
        _comentario.clear();
      });
    } catch (e) {
      setState(() => _reviewMsg = '$e');
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Produto',
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null || _produto == null
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(_error ?? 'Produto não encontrado'),
                      TextButton(
                        onPressed: () => Navigator.pushNamedAndRemoveUntil(
                          context,
                          AppRoutes.home,
                          (_) => false,
                        ),
                        child: const Text('Voltar ao catálogo'),
                      ),
                    ],
                  ),
                )
              : _content(_produto!),
    );
  }

  Widget _content(Produto p) {
    final session = SessionScope.of(context);
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (p.imagem.isNotEmpty)
          AspectRatio(
            aspectRatio: 16 / 10,
            child: Image.network(p.imagem, fit: BoxFit.contain),
          ),
        const SizedBox(height: 12),
        Text(p.nome, style: Theme.of(context).textTheme.headlineSmall),
        Text('${p.marca} · ${p.lancamento}'),
        Text(
          'Preço médio: R\$ ${p.precoMedio.toStringAsFixed(2)}',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        const SizedBox(height: 8),
        Text(p.descricao),
        const SizedBox(height: 16),
        const Text('Especificações', style: TextStyle(fontWeight: FontWeight.bold)),
        ...p.especificacoes.entries.map(
          (e) => ListTile(
            dense: true,
            title: Text('${e.key}'),
            trailing: Text('${e.value}'),
          ),
        ),
        const SizedBox(height: 8),
        const Text('Onde comprar', style: TextStyle(fontWeight: FontWeight.bold)),
        ...p.sitesCompra.map(
          (s) => ListTile(
            title: Text(s.loja),
            subtitle: Text('R\$ ${s.preco.toStringAsFixed(2)}\n${s.link}'),
            isThreeLine: true,
          ),
        ),
        const Divider(height: 32),
        Text(
          'Reviews (${_reviewData?.total ?? 0}) · média ${_reviewData?.mediaEstrelas.toStringAsFixed(1) ?? '0.0'}',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        const SizedBox(height: 8),
        if (!session.isLoggedIn)
          TextButton(
            onPressed: () => Navigator.pushNamed(context, AppRoutes.login),
            child: const Text('Faça login para avaliar'),
          )
        else ...[
          Row(
            children: List.generate(5, (i) {
              final n = i + 1;
              return IconButton(
                onPressed: () => setState(() => _estrelas = n),
                icon: Icon(
                  n <= _estrelas ? Icons.star : Icons.star_border,
                  color: const Color(0xFF377F3F),
                ),
              );
            }),
          ),
          TextField(
            controller: _comentario,
            decoration: const InputDecoration(
              labelText: 'Comentário',
              border: OutlineInputBorder(),
            ),
            maxLines: 3,
          ),
          const SizedBox(height: 8),
          FilledButton(
            onPressed: _sending ? null : _submitReview,
            child: Text(_sending ? 'Enviando...' : 'Enviar review'),
          ),
          if (_reviewMsg != null) Text(_reviewMsg!),
        ],
        const SizedBox(height: 12),
        ...(_reviewData?.reviews ?? []).map(
          (r) => Card(
            child: ListTile(
              title: Text('${r.nome} · ${'★' * r.estrelas}'),
              subtitle: Text(r.comentario),
            ),
          ),
        ),
      ],
    );
  }
}
