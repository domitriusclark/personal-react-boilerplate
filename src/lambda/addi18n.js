import querystring from 'querystring';
import faunadb from 'faunadb';

const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_DB_SECRET,
});

export async function handler({
  body,
  queryStringParameters: { language, namespace },
}) {
  const { key } = querystring.parse(body);

  const { ref, data } = await client.query(
    q.Get(
      q.Match(q.Index('i18n_by_language_and_namespace'), [language, namespace]),
    ),
  );

  // ignore request if key was previously added
  // or even worse, key exists yet is still setup to be added
  if (data.i18n[key]) {
    return {
      statusCode: 200,
    };
  }

  return {
    statusCode: (await client.query(
      q.Update(q.Ref(ref), {
        data: {
          ...data,
          i18n: {
            ...data.i18n,
            [key]: key,
          },
        },
      }),
    ))
      ? 200
      : 500,
  };
}