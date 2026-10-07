import { useEffect, useState } from "react";
import api from "../services/api";

export default function KnowledgeBase() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadArticles = async (query = "") => {
    try {
      setLoading(true);

      const response = await api.get(
        `/knowledge${
          query
            ? `?search=${encodeURIComponent(query)}`
            : ""
        }`
      );

      setArticles(
        response.data.articles ||
          response.data.data ||
          response.data ||
          []
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load knowledge base."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const searchArticles = (e) => {
    e.preventDefault();
    loadArticles(search);
  };

  const markHelpful = async (id) => {
    try {
      await api.patch(`/knowledge/${id}/helpful`);

      setMessage("Thanks! Your feedback was recorded.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#101b3d] px-8 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">
            Knowledge Base
          </h1>

          <p className="mt-1 text-slate-300">
            Find solutions to common IT problems.
          </p>

          <form
            onSubmit={searchArticles}
            className="mt-6 flex max-w-3xl gap-3"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Wi-Fi, VPN, password, software..."
              className="flex-1 rounded-xl px-4 py-3 text-slate-800 outline-none"
            />

            <button
              type="submit"
              className="rounded-xl bg-[#ff6b5f] px-6 py-3 font-semibold"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-8">
        {message && (
          <div className="mb-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
            {message}
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center text-slate-500">
            Searching knowledge base...
          </p>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#101b3d]">
              No solutions found
            </h2>

            <p className="mt-2 text-slate-500">
              Try using different keywords.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article._id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-[#101b3d]">
                    {article.title}
                  </h2>

                  {article.category && (
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      {article.category}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {article.content}
                </p>

                {article.solution && (
                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase text-[#101b3d]">
                      Recommended Solution
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
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

                <div className="mt-5 flex items-center justify-between border-t pt-4">
                  <span className="text-xs text-slate-400">
                    {article.views || 0} views
                  </span>

                  <button
                    onClick={() =>
                      markHelpful(article._id)
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#101b3d] hover:bg-slate-50"
                  >
                    👍 Helpful
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}