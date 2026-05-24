// Serviço de histórico — apenas localStorage por enquanto (backend não implementado)
export const historyService = {

  // Registra um acesso a produto
  recordAccess(usuario, produto) {
    if (!produto) return;

    const record = {
      produtoId: produto._id,
      nome: produto.nome,
      marca: produto.marca || "",
      imagem: produto.imagem || "",
      precoMedio: produto.precoMedio || 0,
      categoriaTag: produto.categoriaTag || "",
      acessadoEm: new Date().toISOString()
    };

    const userEmail = usuario?.email || "anonimo";
    this.addToLocalHistory(userEmail, record);
  },

  // Recupera o histórico de acessos
  getHistory(usuario) {
    const userEmail = usuario?.email || "anonimo";
    return this.getLocalHistory(userEmail);
  },

  // Exclui um item específico do histórico
  deleteItem(usuario, produtoId) {
    const userEmail = usuario?.email || "anonimo";
    this.removeFromLocalHistory(userEmail, produtoId);
  },

  // Limpa todo o histórico de acessos
  clearHistory(usuario) {
    const userEmail = usuario?.email || "anonimo";
    this.clearLocalHistory(userEmail);
  },

  // Utilitários de localStorage
  getLocalHistory(email) {
    try {
      const historyStr = localStorage.getItem(`history_${email}`);
      return historyStr ? JSON.parse(historyStr) : [];
    } catch {
      return [];
    }
  },

  addToLocalHistory(email, record) {
    try {
      let history = this.getLocalHistory(email);
      // Remove ocorrência anterior do mesmo produto para não duplicar
      history = history.filter(item => item.produtoId !== record.produtoId);
      // Insere no início (mais recente primeiro)
      history.unshift(record);
      // Limita a 50 itens
      if (history.length > 50) history = history.slice(0, 50);
      localStorage.setItem(`history_${email}`, JSON.stringify(history));
    } catch (err) {
      console.error("Erro ao escrever no localStorage:", err);
    }
  },

  removeFromLocalHistory(email, produtoId) {
    try {
      let history = this.getLocalHistory(email);
      history = history.filter(item => item.produtoId !== produtoId);
      localStorage.setItem(`history_${email}`, JSON.stringify(history));
    } catch (err) {
      console.error("Erro ao remover do localStorage:", err);
    }
  },

  clearLocalHistory(email) {
    try {
      localStorage.removeItem(`history_${email}`);
    } catch (err) {
      console.error("Erro ao limpar localStorage:", err);
    }
  }
};
