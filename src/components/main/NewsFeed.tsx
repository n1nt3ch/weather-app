// src/components/NewsFeed.tsx
import { useGetTopHeadlinesQuery, useGetNewsByQueryQuery } from "@/store/api/newsApi/newsApi";

export const NewsFeed = () => {
  const { data, error, isLoading } = useGetTopHeadlinesQuery({ country: '', category: '', language: '' }); // 🔥 изменено

  if (isLoading) return <div>Загрузка новостей...</div>;
  if (error) {
    const errorMessage = 'error' in error
      ? error.error
      : 'status' in error
        ? `Ошибка ${error.status}`
        : 'Неизвестная ошибка';
    return <div>Ошибка: {errorMessage}</div>;
  }

  // 🔍 Отладка: проверим, что пришло
  console.log('Полученные данные:', data);

  if (!data || !data.articles || data.articles.length === 0) {
    return <div>Новостей пока нет.</div>;
  }

  return (
    <div>
      <h2>Новости</h2>
      {data.articles.slice(0, 10).map((article, index) => (
        <article key={index} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', padding: '1rem' }}>
          {article.urlToImage && (
            <img
              src={article.urlToImage}
              alt={article.title}
              style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '0.5rem' }}
            />
          )}
          <h3>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </h3>
          <p>{article.description || 'Нет описания'}</p>
          <small>
            {new Date(article.publishedAt).toLocaleString('ru-RU')}
          </small>
        </article>
      ))}
    </div>
  );
}