import { useState, useEffect } from "react";
import {
  KnowledgeBaseData,
  Article,
  Category,
  Source,
  ArticleRelation,
  ArticleRevision,
  Contributor,
  ReviewStatus,
} from "./types";

const STORAGE_KEY = "aio_knowledge_base_data_v1";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-tech", name: "Teknologi & AI", parentCategoryId: null, description: "Arsitektur, LLM, dan rekayasa perangkat lunak" },
  { id: "cat-ai-rag", name: "Retrieval-Augmented Generation (RAG)", parentCategoryId: "cat-tech", description: "Vektor, embedding, dan grounding pengetahuan" },
  { id: "cat-arch", name: "Sistem Terdistribusi", parentCategoryId: "cat-tech", description: "Konsistensi data, event sourcing, dan microservices" },
  { id: "cat-biz", name: "Operasional & Bisnis", parentCategoryId: null, description: "Proses operasional, kepatuhan, dan strategi" },
];

const DEFAULT_ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "Prinsip Dasar RAG (Retrieval-Augmented Generation)",
    summary: "Konsep pemisahan retrieval dokumen dari generasi respon model bahasa untuk menjamin akurasi faktual.",
    content: `# Prinsip Dasar RAG

Retrieval-Augmented Generation (RAG) adalah arsitektur yang mengombinasikan retrieval model dengan generative LLM.

## Mengapa RAG Dibutuhkan?
1. Mengurangi resiko halusinasi model.
2. Memungkinkan pembaruan data tanpa retraining model yang memakan biaya besar.
3. Memberikan sitasi dan bukti rujukan faktual yang traceable.

## Komponen Utama
- **Document Chunking & Vectorization**: Dokumen dipecah menjadi unit semantik dan di-embed ke vector database.
- **Similarity Search**: Kueri pengguna dicocokkan dengan k chunk paling relevan.
- **Augmented Prompting**: Konteks hasil retrieval digabungkan ke system prompt sebelum diteruskan ke model LLM.`,
    categoryId: "cat-ai-rag",
    tags: ["RAG", "LLM", "AI", "Vector DB"],
    reviewStatus: "verified",
    lastReviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 hari lalu
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "art-2",
    title: "Implementasi RAG Produksi dengan Hybrid Search",
    summary: "Teknik penggabungan BM25 keyword search dan Dense Vector retrieval untuk akurasi domain teknis.",
    content: `# Implementasi RAG Produksi dengan Hybrid Search

Dalam domain khusus seperti hukum, medis, atau keuangan, pencarian vektor murni sering kali melewatkan nomor serial atau istilah eksak.

## Pendekatan Hybrid
Kombinasikan sparse keyword (BM25) dan dense vector (Cosine Similarity) menggunakan Reciprocal Rank Fusion (RRF).

\`\`\`
RRF_Score(d) = Σ [ 1 / (k + rank_sparse(d)) ] + [ 1 / (k + rank_dense(d)) ]
\`\`\`

## Rekomendasi Deployment
- Gunakan chunk size 500-1000 token dengan 10% overlap.
- Gunakan re-ranker model (Cross-Encoder) untuk top 20 hasil sebelum prompting.`,
    categoryId: "cat-ai-rag",
    tags: ["RAG", "Hybrid Search", "BM25", "Production"],
    reviewStatus: "reviewed",
    lastReviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: "art-3",
    title: "Standar Keamanan Enkripsi Data Multi-Tenant",
    summary: "Panduan arsitektur isolasi kunci enkripsi per-tenant dan kepatuhan standar ISO 27001.",
    content: `# Standar Keamanan Enkripsi Data Multi-Tenant

Setiap tenant wajib memiliki key envelope encryption yang independen.

- Master Key disimpan pada Hardware Security Module (HSM).
- Data Encryption Key (DEK) di-rotate setiap 90 hari.
- Akses audit log tidak boleh dapat di-tamper.`,
    categoryId: "cat-biz",
    tags: ["Security", "Encryption", "Multi-Tenant", "ISO27001"],
    reviewStatus: "outdated",
    lastReviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 220).toISOString(), // > 180 hari (outdated)
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 220).toISOString(),
  },
];

const DEFAULT_SOURCES: Source[] = [
  {
    id: "src-1",
    articleId: "art-1",
    type: "paper",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    author: "Lewis et al. (Meta AI)",
    url: "https://arxiv.org/abs/2005.11401",
    publishedAt: "2020-05-22",
    reliability: "high",
    excerpt: "We show that hybrid retrieval combined with seq2seq generation strongly outperforms non-retrieval models on open-domain question answering.",
    addedAt: new Date().toISOString(),
  },
  {
    id: "src-2",
    articleId: "art-2",
    type: "website",
    title: "Pinecone: Hybrid Search in Production Guide",
    author: "Pinecone Engineering",
    url: "https://docs.pinecone.io/guides/hybrid-search",
    reliability: "high",
    addedAt: new Date().toISOString(),
  },
];

const DEFAULT_RELATIONS: ArticleRelation[] = [
  {
    id: "rel-1",
    fromArticleId: "art-2",
    toArticleId: "art-1",
    type: "prerequisite",
    note: "Memahami konsep dasar RAG sangat esensial sebelum menerapkan teknik hybrid search di production.",
  },
];

const DEFAULT_REVISIONS: ArticleRevision[] = [
  {
    id: "rev-1",
    articleId: "art-1",
    content: DEFAULT_ARTICLES[0].content,
    editedBy: "Lead Knowledge Architect",
    editedAt: DEFAULT_ARTICLES[0].updatedAt,
    changeSummary: "Inisiasi awal dokumen arsitektur RAG",
  },
];

const DEFAULT_CONTRIBUTORS: Contributor[] = [
  {
    articleId: "art-1",
    userId: "user-system",
    role: "author",
    contributedAt: DEFAULT_ARTICLES[0].createdAt,
  },
];

const INITIAL_DATA: KnowledgeBaseData = {
  articles: DEFAULT_ARTICLES,
  categories: DEFAULT_CATEGORIES,
  sources: DEFAULT_SOURCES,
  relations: DEFAULT_RELATIONS,
  revisions: DEFAULT_REVISIONS,
  contributors: DEFAULT_CONTRIBUTORS,
  reviewReminderIntervalDays: 180,
};

function loadKBData(): KnowledgeBaseData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_DATA,
      ...parsed,
      articles: Array.isArray(parsed.articles) ? parsed.articles : INITIAL_DATA.articles,
      categories: Array.isArray(parsed.categories) ? parsed.categories : INITIAL_DATA.categories,
      sources: Array.isArray(parsed.sources) ? parsed.sources : INITIAL_DATA.sources,
      relations: Array.isArray(parsed.relations) ? parsed.relations : INITIAL_DATA.relations,
      revisions: Array.isArray(parsed.revisions) ? parsed.revisions : INITIAL_DATA.revisions,
      contributors: Array.isArray(parsed.contributors) ? parsed.contributors : INITIAL_DATA.contributors,
    };
  } catch (e) {
    console.error("Failed to load Knowledge Base data:", e);
    return INITIAL_DATA;
  }
}

function saveKBData(data: KnowledgeBaseData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save Knowledge Base data:", e);
  }
}

export function useKnowledgeBaseStore() {
  const [data, setData] = useState<KnowledgeBaseData>(loadKBData);

  useEffect(() => {
    saveKBData(data);
  }, [data]);

  const addArticle = (article: Omit<Article, "id" | "createdAt" | "updatedAt">): Article => {
    const now = new Date().toISOString();
    const newArt: Article = {
      ...article,
      id: `art-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
      lastReviewedAt: now,
    };

    const initialRevision: ArticleRevision = {
      id: `rev-${Date.now()}`,
      articleId: newArt.id,
      content: newArt.content,
      editedBy: "Current User",
      editedAt: now,
      changeSummary: "Dibuat pertama kali",
    };

    const initialContributor: Contributor = {
      articleId: newArt.id,
      userId: "current-user",
      role: "author",
      contributedAt: now,
    };

    setData((prev) => ({
      ...prev,
      articles: [newArt, ...prev.articles],
      revisions: [initialRevision, ...prev.revisions],
      contributors: [initialContributor, ...prev.contributors],
    }));

    return newArt;
  };

  const updateArticle = (
    id: string,
    updates: Partial<Omit<Article, "id" | "createdAt">>,
    changeSummary?: string
  ) => {
    const now = new Date().toISOString();
    setData((prev) => {
      const existing = prev.articles.find((a) => a.id === id);
      if (!existing) return prev;

      const updatedArticle: Article = {
        ...existing,
        ...updates,
        updatedAt: now,
      };

      const newRevisions = [...prev.revisions];
      if (updates.content && updates.content !== existing.content) {
        newRevisions.unshift({
          id: `rev-${Date.now()}`,
          articleId: id,
          content: updates.content,
          editedBy: "Current User",
          editedAt: now,
          changeSummary: changeSummary || "Pembaruan konten artikel",
        });
      }

      return {
        ...prev,
        articles: prev.articles.map((a) => (a.id === id ? updatedArticle : a)),
        revisions: newRevisions,
      };
    });
  };

  const deleteArticle = (id: string) => {
    setData((prev) => ({
      ...prev,
      articles: prev.articles.filter((a) => a.id !== id),
      sources: prev.sources.filter((s) => s.articleId !== id),
      relations: prev.relations.filter((r) => r.fromArticleId !== id && r.toArticleId !== id),
      revisions: prev.revisions.filter((r) => r.articleId !== id),
      contributors: prev.contributors.filter((c) => c.articleId !== id),
    }));
  };

  const duplicateArticle = (id: string) => {
    const sourceArt = data.articles.find((a) => a.id === id);
    if (!sourceArt) return;
    addArticle({
      title: `${sourceArt.title} (Salinan)`,
      content: sourceArt.content,
      summary: sourceArt.summary,
      categoryId: sourceArt.categoryId,
      tags: [...sourceArt.tags],
      reviewStatus: "draft",
    });
  };

  const addCategory = (category: Omit<Category, "id">) => {
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat],
    }));
    return newCat;
  };

  const deleteCategory = (id: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
      articles: prev.articles.map((a) => (a.categoryId === id ? { ...a, categoryId: null } : a)),
    }));
  };

  const addSource = (source: Omit<Source, "id" | "addedAt">) => {
    const newSrc: Source = {
      ...source,
      id: `src-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      addedAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      sources: [...prev.sources, newSrc],
    }));
    return newSrc;
  };

  const deleteSource = (id: string) => {
    setData((prev) => ({
      ...prev,
      sources: prev.sources.filter((s) => s.id !== id),
    }));
  };

  const addRelation = (relation: Omit<ArticleRelation, "id">) => {
    const newRel: ArticleRelation = {
      ...relation,
      id: `rel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setData((prev) => ({
      ...prev,
      relations: [...prev.relations, newRel],
    }));
    return newRel;
  };

  const deleteRelation = (id: string) => {
    setData((prev) => ({
      ...prev,
      relations: prev.relations.filter((r) => r.id !== id),
    }));
  };

  const markOutdated = (id: string) => {
    updateArticle(id, { reviewStatus: "outdated" }, "Ditandai perlu ditinjau ulang (outdated)");
  };

  const verifyArticle = (id: string) => {
    const now = new Date().toISOString();
    updateArticle(
      id,
      { reviewStatus: "verified", lastReviewedAt: now },
      "Divalidasi kebenarannya & sumber telah diverifikasi"
    );
  };

  const promoteFromNote = (noteId: string, noteTitle: string, noteContent: string) => {
    return addArticle({
      title: noteTitle,
      content: noteContent,
      summary: `Dipromosikan dari Catatan #${noteId}`,
      tags: ["From-Notes"],
      reviewStatus: "draft",
    });
  };

  const isNeedsReview = (article: Article) => {
    if (article.reviewStatus === "outdated") return true;
    if (!article.lastReviewedAt) return true;
    const diffDays =
      (Date.now() - new Date(article.lastReviewedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > data.reviewReminderIntervalDays;
  };

  return {
    data,
    articles: data.articles,
    categories: data.categories,
    sources: data.sources,
    relations: data.relations,
    revisions: data.revisions,
    contributors: data.contributors,
    addArticle,
    updateArticle,
    deleteArticle,
    duplicateArticle,
    addCategory,
    deleteCategory,
    addSource,
    deleteSource,
    addRelation,
    deleteRelation,
    markOutdated,
    verifyArticle,
    promoteFromNote,
    isNeedsReview,
  };
}
