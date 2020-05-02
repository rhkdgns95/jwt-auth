import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
   __typename?: 'Query';
  sayHello: Scalars['String'];
  getMyProfile: GetMyProfileResponse;
  users: Array<User>;
};

export type GetMyProfileResponse = {
   __typename?: 'GetMyProfileResponse';
  ok: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  password: Scalars['String'];
  tokenVersion: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
   __typename?: 'Mutation';
  emailSignIn: EmailSignInResponse;
  emailSignUp: EmailSignUpResponse;
  revokeRefreshTokensForUser: RevokeRefreshTokenForUsersResponse;
};


export type MutationEmailSignInArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationEmailSignUpArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};

export type EmailSignInResponse = {
   __typename?: 'EmailSignInResponse';
  ok: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type EmailSignUpResponse = {
   __typename?: 'EmailSignUpResponse';
  ok: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type RevokeRefreshTokenForUsersResponse = {
   __typename?: 'RevokeRefreshTokenForUsersResponse';
  ok: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export type EmailSignInMutationVariables = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type EmailSignInMutation = (
  { __typename?: 'Mutation' }
  & { emailSignIn: (
    { __typename?: 'EmailSignInResponse' }
    & Pick<EmailSignInResponse, 'ok' | 'error' | 'token'>
  ) }
);

export type EmailSignUpMutationVariables = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type EmailSignUpMutation = (
  { __typename?: 'Mutation' }
  & { emailSignUp: (
    { __typename?: 'EmailSignUpResponse' }
    & Pick<EmailSignUpResponse, 'ok' | 'error'>
  ) }
);

export type ItemUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email' | 'tokenVersion' | 'createdAt' | 'updatedAt'>
);

export type GetMyProfileQueryVariables = {};


export type GetMyProfileQuery = (
  { __typename?: 'Query' }
  & { getMyProfile: (
    { __typename?: 'GetMyProfileResponse' }
    & Pick<GetMyProfileResponse, 'ok' | 'error'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & ItemUserFragment
    )> }
  ) }
);

export type SayHelloQueryVariables = {};


export type SayHelloQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'sayHello'>
);

export type UsersQueryVariables = {};


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & ItemUserFragment
  )> }
);

export const ItemUserFragmentDoc = gql`
    fragment ItemUser on User {
  id
  email
  tokenVersion
  createdAt
  updatedAt
}
    `;
export const EmailSignInDocument = gql`
    mutation EmailSignIn($email: String!, $password: String!) {
  emailSignIn(email: $email, password: $password) {
    ok
    error
    token
  }
}
    `;
export type EmailSignInMutationFn = ApolloReactCommon.MutationFunction<EmailSignInMutation, EmailSignInMutationVariables>;

/**
 * __useEmailSignInMutation__
 *
 * To run a mutation, you first call `useEmailSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmailSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [emailSignInMutation, { data, loading, error }] = useEmailSignInMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useEmailSignInMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EmailSignInMutation, EmailSignInMutationVariables>) {
        return ApolloReactHooks.useMutation<EmailSignInMutation, EmailSignInMutationVariables>(EmailSignInDocument, baseOptions);
      }
export type EmailSignInMutationHookResult = ReturnType<typeof useEmailSignInMutation>;
export type EmailSignInMutationResult = ApolloReactCommon.MutationResult<EmailSignInMutation>;
export type EmailSignInMutationOptions = ApolloReactCommon.BaseMutationOptions<EmailSignInMutation, EmailSignInMutationVariables>;
export const EmailSignUpDocument = gql`
    mutation EmailSignUp($email: String!, $password: String!) {
  emailSignUp(email: $email, password: $password) {
    ok
    error
  }
}
    `;
export type EmailSignUpMutationFn = ApolloReactCommon.MutationFunction<EmailSignUpMutation, EmailSignUpMutationVariables>;

/**
 * __useEmailSignUpMutation__
 *
 * To run a mutation, you first call `useEmailSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmailSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [emailSignUpMutation, { data, loading, error }] = useEmailSignUpMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useEmailSignUpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EmailSignUpMutation, EmailSignUpMutationVariables>) {
        return ApolloReactHooks.useMutation<EmailSignUpMutation, EmailSignUpMutationVariables>(EmailSignUpDocument, baseOptions);
      }
export type EmailSignUpMutationHookResult = ReturnType<typeof useEmailSignUpMutation>;
export type EmailSignUpMutationResult = ApolloReactCommon.MutationResult<EmailSignUpMutation>;
export type EmailSignUpMutationOptions = ApolloReactCommon.BaseMutationOptions<EmailSignUpMutation, EmailSignUpMutationVariables>;
export const GetMyProfileDocument = gql`
    query GetMyProfile {
  getMyProfile {
    ok
    error
    user {
      ...ItemUser
    }
  }
}
    ${ItemUserFragmentDoc}`;

/**
 * __useGetMyProfileQuery__
 *
 * To run a query within a React component, call `useGetMyProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyProfileQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>) {
        return ApolloReactHooks.useQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(GetMyProfileDocument, baseOptions);
      }
export function useGetMyProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(GetMyProfileDocument, baseOptions);
        }
export type GetMyProfileQueryHookResult = ReturnType<typeof useGetMyProfileQuery>;
export type GetMyProfileLazyQueryHookResult = ReturnType<typeof useGetMyProfileLazyQuery>;
export type GetMyProfileQueryResult = ApolloReactCommon.QueryResult<GetMyProfileQuery, GetMyProfileQueryVariables>;
export const SayHelloDocument = gql`
    query SayHello {
  sayHello
}
    `;

/**
 * __useSayHelloQuery__
 *
 * To run a query within a React component, call `useSayHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useSayHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSayHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useSayHelloQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SayHelloQuery, SayHelloQueryVariables>) {
        return ApolloReactHooks.useQuery<SayHelloQuery, SayHelloQueryVariables>(SayHelloDocument, baseOptions);
      }
export function useSayHelloLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SayHelloQuery, SayHelloQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SayHelloQuery, SayHelloQueryVariables>(SayHelloDocument, baseOptions);
        }
export type SayHelloQueryHookResult = ReturnType<typeof useSayHelloQuery>;
export type SayHelloLazyQueryHookResult = ReturnType<typeof useSayHelloLazyQuery>;
export type SayHelloQueryResult = ApolloReactCommon.QueryResult<SayHelloQuery, SayHelloQueryVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    ...ItemUser
  }
}
    ${ItemUserFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
export function useUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = ApolloReactCommon.QueryResult<UsersQuery, UsersQueryVariables>;