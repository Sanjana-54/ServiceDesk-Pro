import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  title: "",
  content: "",
  category: "",
  tags: "",
  solution: "",
};

export default function KnowledgeBaseManagement() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadArticles = async () => {
    try {
      setLoading(true);

      const response = await api.get("/knowledge");

      setArticles(
        response.data.articles ||
          response.data.data ||
          response.data ||
          []
      );
    } catch (error) {
      console.error("Knowledge Base error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load knowledge articles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const createArticle = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      setMessage("Title and content are required.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await api.post("/knowledge", {
        title: form.title,
        content: form.content,
        category: form.category,
        solution: form.solution,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      setForm(initialForm);

      setMessage(
        "Knowledge article created successfully."
      );

      await loadArticles();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to create knowledge article."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/knowledge/${id}`);

      setMessage("Article deleted successfully.");

      await loadArticles();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to delete article."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#101b3d]">
            Knowledge Base Management
          </h1>

          <p className="mt-1 text-slate-500">
            Create and manage troubleshooting solutions.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Create Article */}
          <form
            onSubmit={createArticle}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-[#101b3d]">
              Create Article
            </h2>

            <div className="mt-5 space-y-4">
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Article title"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#ff6b5f]"
              />

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#ff6b5f]"
              />

              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Tags: wifi, network, vpn"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#ff6b5f]"
              />

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the problem..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#ff6b5f]"
              />

              <textarea
                name="solution"
                value={form.solution}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the solution..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#ff6b5f]"
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-[#ff6b5f] px-5 py-3 font-semibold text-white transition hover:bg-[#ef5a50] disabled:opacity-60"
              >
                {saving
                  ? "Creating..."
                  : "Create Article"}
              </button>
            </div>
          </form>

          {/* Existing Articles */}
          <section className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#101b3d]">
                  Existing Articles
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Knowledge articles available to support users.
                </p>
              </div>

              <button
                onClick={loadArticles}
                className="rounded-lg bg-[#101b3d] px-4 py-2 text-sm font-semibold text-white"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="mt-10 text-center text-slate-500">
                Loading articles...
              </p>
            ) : articles.length === 0 ? (
              <div className="mt-8 rounded-xl bg-slate-50 p-8 text-center">
                <p className="font-semibold text-[#101b3d]">
                  No articles yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Create your first knowledge-base article.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {articles.map((article) => (
                  <div
                    key={article._id}
                    className="rounded-xl border border-slate-200 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-[#101b3d]">
                          {article.title}
                        </h3>

                        {article.category && (
                          <span className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                            {article.category}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          deleteArticle(article._id)
                        }
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {article.content}
                    </p>

                    {article.solution && (
                      <div className="mt-4 rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase text-[#101b3d]">
                          Solution
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {article.solution}
                        </p>
                      </div>
                    )}

                    {article.tags?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <span
                            key={`${tag}-${index}`}
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex gap-5 border-t pt-3 text-xs text-slate-400">
                      <span>
                        Views: {article.views || 0}
                      </span>

                      <span>
                        Helpful: {article.helpfulCount || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}