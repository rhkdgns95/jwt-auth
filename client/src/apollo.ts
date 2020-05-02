import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable, Operation } from "apollo-link";
import { getAccessToken, setAccessToken } from "./accessToken";
import jwtDecode from "jwt-decode";
import { TokenRefreshLink } from "apollo-link-token-refresh";

const cache = new InMemoryCache({});
const uri = "http://localhost:4000/graphql";
const refreshToken_uri = "http://localhost:4000/refresh_token";

const request = async (operation: Operation) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: {
        "X-JID": `bearer ${accessToken}`,
      },
    });
  }
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any;
      Promise.resolve(operation)
        .then(request)
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: (): boolean => {
        console.log("1. isTokenValidOrUndefined");
        const token = getAccessToken();
        if (!token) {
          return true;
        }

        try {
          const { exp } = jwtDecode(token);
          if (Date.now() >= exp * 1000) {
            // token의 기간이 유효하지 않은경우, expired
            console.log("토큰 기간유효X");
            return false;
          } else {
            console.log("토큰 기간유효O");
            // token의 기간이 유효한 경우,
            return true;
          }
        } catch (error) {
          console.log("refreshTokenUndefiend error: ", error);
          return false;
        }
      },
      fetchAccessToken: () => {
        console.log("2. isTokenValidOrUndefined");
        return fetch(refreshToken_uri, {
          method: "POST",
          credentials: "include",
        });
      },
      handleFetch: (accessToken: string) => {
        console.log("3. isTokenValidOrUndefined");
        console.log("accessToken: ", accessToken);
        setAccessToken(accessToken);
      },
      handleError: (err: any) => {
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
      },
    }),
    onError(({ graphQLErrors, networkError }) => {
      console.log("graphQLErrors: ", graphQLErrors);
      console.log("networkError: ", networkError);
    }),
    requestLink,
    new HttpLink({
      uri,
      credentials: "include",
    }),
  ]),
  cache,
});

export default client;
