export const fetchFunctionTypescript = `
const apiFetch = (options: fetchOptions, query: string, name?: string) => {
    let fetchFunction;
    let queryString = query;
    let fetchOptions = options[1] || {};
    if (typeof fetch !== 'undefined') {
      fetchFunction = fetch;
    } else {
      try {
        fetchFunction = require('node-fetch');
      } catch (error) {
        throw new Error("Please install 'node-fetch' to use zeus in nodejs environment");
      }
    }
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      if (typeof encodeURIComponent !== 'undefined') {
        queryString = encodeURIComponent(query);
      } else {
        queryString = require('querystring').stringify(query);
      }
      return fetchFunction(\`\${options[0]}?query=\${queryString}\`, fetchOptions)
        .then((response: any) => response.json() as Promise<GraphQLResponse>)
        .then((response: GraphQLResponse) => {
          if (response.errors) {
            throw new GraphQLError(response);
          }
          if (!name) {
            return response.data;
          }
          return response.data && response.data[name];
        });
    }
    return fetchFunction(\`\${options[0]}\`, {
      body: JSON.stringify({ query: queryString }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      ...fetchOptions
    })
      .then((response: any) => response.json() as Promise<GraphQLResponse>)
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        if (!name) {
          return response.data;
        }
        return response.data && response.data[name];
      });
  };
  `;
