# jwt-auth.
- jwt을 통해서 인증 구현

---
### 1. How working? 
1. 로그인 요청시 서버는 accessToken과 refreshToken을 반환(accessToken: 15분, refreshToken: 1일)
2. refreshToken은 cookie에 accessToken은 사용자의 메모리에서 관리.
3. 클라이언트 측의 (보안이 필요한)요청에 대해서는 accessToken으로 접근.
4. accessToken기간 만료시, 쿠키의 refreshToken으로 인증 확인 후 새로운 accessToken 발급.
5. refreshToken기간 만료시, 새 로그인 접속이 필요함.
6. payload에는 `userId`와 `tokenVersion`을 저장.
7. 로그아웃 시, 유저의 tokenVersion을 업데이트하여 기존의 tokenVersion이 있는경우 대해서 refreshToken 발급을 제한시킴.

---
### 2. Todo.
- server
  - [x] type-graphql server init. 
  - [x] Resolver - EmailSignUp, Login
  - [x] Resolver - EmailSignIn, JWT
  - [x] Resolver - GetMyProfile RevokeRefreshTokensForUser, cookie-parser, update refresh-token

- client
  - [x] Init react app.
  - [x] @graphql-codegen.
  - [x] Routes - Login, Register, About, accessToken.
  - [x] Keep Login - accessToken/refreshToken.
  - [x] apollo-link-refresh-token.
  - [ ] login/out auto rendering.
- quest(해야할 것들)
  - [ ] Random값의 tokenVersion 기능.
  - [ ] refreshToken을 갖는 cookie의 기간 입력.
  - [ ] refreshToken을 새로 발급받으면, 기존의 refreshToken은 파기하도록 할 것.
---
### 3. Install.
- server  
```bash
yarn add -D typescript prettier
npx tsconfig.json
yarn add typeorm
yarn 
yarn upgrade-interactive --latest
yarn add reflect-metadata
yarn add graphql type-graphql
yarn add -D @types/graphql
yarn add -D ts-node nodemon
yarn add express apollo-server-express
yarn upgrade graphql@14.1.1
yarn add bcryptjs
yarn add -D @types/bcryptjs
yarn add class-validator
yarn add jsonwebtoken
yarn add -D @types/jsonwebtoken
yarn add dotenv
yarn add -D @types/dotenv
yarn add cookie-parser
yarn add -D @types/cookie-parser
yarn add cors
yarn add -D @types/cors
```

- client
```bash
yarn add react react-dom 
yarn add parcel-bundler
yarn add -D @types/react @types/react-dom typescript
yarn add apollo-boost @apollo/react-hooks graphql
yarn add -D @types/graphql
yarn add -D @graphql-codegen/cli
npx graphql-codegen init
yarn add react-router-dom
yarn add -D @types/react-router-dom
yarn add apollo-link-token-refresh
yarn add jwt-decode
yarn add -D @types/jwt-decode
```

---

### 4. Example.
- server
  <details>
  <summary>type-graphql query</summary>

  <p>

  ```ts
  // src/user/api/UserResolver.ts
  import { Resolver } from 'type-graphql';
  import { User } from '../../entity/User';

  @Resolver(User)
  class UserResolver {
    @Query(() => String)
    async sayHello (): Promise<string> {
      return 'hello';
    }
  }

  ```
  </p>
  </details>

  <details>
  <summary>type-graphql mutation</summary>
  <p>

  ```ts
  /**
   *  다른 api 리졸버에서 참조하기 위해서 @ObjectType를 @Entity()에서는 꼭 사용하도록 해야함.
   */
  // src/entity/User.ts
  @ObjectType() 
  @Entity('users')
  class User extends BaseEntity {
    //...
  }
  // src/api/user/UserResolver.ts
  @Mutation(() => EmailSignUpResponse)
  async emailSignUp(
    @Arg('email') email: string,
    @Arg('passsword') password: string
  ): Promise<EmailSignUpResponse> {
    try {
      const hashPassword = bcrypt.hashSync(password, 10);
      const user = await User.create({
        email,
        password: hashPassword
      }).save(); // save를 사용해야 id가 생성되므로 return시 user값에서 에러가 발생하지 않음.
      
      return {
        ok: true,
        error: undefined,
        user
      };
    } catch(error) {
      return {
        ok: false,
        error: error.message,
        user: undefined
      };
    }
  }

  ```
  </p>
  </details>

  <details>
  <summary>cookie parser</summary>
  <p>

  ```ts
  import cookieParser from 'cookie-parser';
  import express from 'express';

  const app = express();
  // '/test'경로에만 cookieParser를 적용하여, 다른 라우터에 요청시 필요없는 오버헤드를 줄일 수 있음.
  app.use('/test', cookieParser());
  app.get('/test', (req, res) => {
    console.log('cookies: ', req.cookies.jid);
  });

  ```
  </p>
  </details>

  <details>
  <summary>/refresh_token</summary>
  <p>

  ```ts
  import cookieParser from 'cookie-parser';
  import express from 'express';
  import { createRefreshToken } from './createRefreshToken';
  import { createAccessToken } from './createAccessToken';

  /**
   *  refreshToken의 발급조건:
   *  1. cookie에 refreshToken값이 존재해야함.
   *  2. refreshToken의 만료기간.
   *  3. payload에 userId가 존재 + user의 id값과 동일한 user가 있어야 함.
   *  4. payload에 tokenVersion이 user의 tokenVersion과 동일해야 함.
   * 
   */

  const app = express();

  // refresh_token경로에서만 cookieParser적용(다른 URL의 요청과는 별개로 오버헤드가 발생하지 않도록 할 것)
  app.use('/refresh_token', cookieParser());  
  app.get('/refresh_token', async (_req, res) => {
    const token: string | undefined = res.cookies.jid;
    if(token) {
      try {
        const payload = verify(token, process.env.JWT_REFRESH_SECRET);

        // payloa의 tokenVersion과 userId가 0인경우가 있으므로 in을 통해 올바른 토큰타입 확인.
        if('userId' in payload && 
        'tokenVersion' in payload) {
          const user: User | undefined = await User.findOne({ id: payload.userId });
          if(user && (payload.tokenVersion === user.tokenVersion)) {
            // ok
            const refreshToken = createRefreshToken(user);
            const accessToken = createAccessToken(user);

            // refreshToken을 기존의 cookie에 덮어씌우기
            res.cookie('jid', refreshToken,
              { httpOnly: true }
            );
            return res.send({
              ok: true,
              error: undefined,
              accessToken,
            });
          } else {
            return res.send({
              ok: false,
              error: 'Not found user Or Wrong tokenVersion',
              accessToken: undefined,
            });
          }
          
        } else { // token 정책이 맞지 않은경우,
          return res.send({
            ok: false,
            error: 'Wrong token',
            accessToken: undefined
          });
        }
      } catch(error) {
        return res.send({ 
          ok: false, 
          error: error.message, 
          accessToken: undefined,
        });
      }
    } else {
      return res.send({ 
        ok: false, 
        error: 'No authenticated', 
        accessToken: undefined,
      });
    }
  })

  ```
  </p>
  </details>

- client
  <details>
  <summary>ApolloProvider</summary>
  <p>

  ```ts
  import React from "react";
  import ReactDOM from "react-dom";
  import App from "./App";
  import ApolloClient from "apollo-boost";
  import { ApolloProvider } from "@apollo/react-hooks";

  const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
  });

  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById("root")
  );

  ```
  </p>
  </details>

  <details>
  <summary>npx graphql-codegen init</summary>
  <p>
  
  ```bash
  $ npx graphql-codegen init
  ? What type of application are you building? Application built with React
  ? Where is your schema?: (path or url) http://localhost:4000/graphql
  ? Where are your operations and fragments?: src/graphql/*.graphql
  ? Pick plugins: TypeScript (required by other typescript plugins), TypeScript Operations (operations and fragments), TypeScript React Apollo (typed components and HOCs)
  ? Where to write the output: src/generated/graphql.tsx
  ? Do you want to generate an introspection file? No
  ? How to name the config file? codegen.yml
  ? What script in package.json should run the codegen? codegen
  
  # /src/codegen.yml파일이 생성됨.
  # package.json을 보면, codegen 플러그인들이 devDependencies에 추가되어있을 것이다.
  # 따라서 설치를 해주도록 하자
  $ yarn  

  $ yarn codegen
  ```
  </p>
  </details>

  <details>
  <summary>codegen example</summary>
  <p>
  
  ```graphql

  ## src/graphql/hello.graphql
  query SayHello {
    sayHello
  }
  
  ```

  ```bash
  $ yarn codegen 
  ``` 
  </p>
  </details>

  <details>
  <summary>App Continuously-Login</summary>
  <p>
  
  ```ts
  // index.tsx

  const App = () => {
    const [fetchLoading, setFetchLoading] = useState<boolean>(true);
    const [isLoggedIn, setIsLoggedIn]  = useState<boolean>(false);

    useEffect(() => {
      fetch('http://localhost:4000/refresh_token', {
        method: 'POST',
        credentials: 'include',
      }).then(async x => {
        const { ok, accessToken } = await x.json();
        if(ok && accessToken) { // success login,
          setIsLoggedIn(true);
          setAccessToken(accessToken);
        } else {
          setIsLoggedIn(false);
          setAccessToken('');
        }
        setFetchLoading(false);        
      })
    }, []);

    if(fetchLoading) {
      return <div>loading...</div>;
    }

    return <>{ isLoggedIn ? 'Hello' : 'Please Login' }</>;
  }
  ```
  </p>
  </details>

  <details>
  <summary>apollo-link-token-refresh</summary>
  <p>
  ```ts

  ```
  </p>
  </details>
---
### 5. Study.
- server
  - entry file에는 import "reflect-metadata"; 을 명시해주도록 하기(type-graphql의 decorator를 사용하기 위함)
  - @IsEmail()과 같이 이메일인지 확인하는 정규식 판단여부를 동작시키는 방법을 찾아야 됨.
  - Context를 가져오기 위해서는 ApolloServer에서 context를 반환해주는 메소드를 생성해주도록 해야함.
- client
  
- 전체
  - Client의 Cookie 요청
    ```ts
    // apollo.ts
    const client = new ApolloClient({
      uri: '.../graphql',
      credentials: 'include',
    });
    ```
  - Server의 Cookie 응답
    ```ts
    // index.ts
    import cors from 'cors';
    import express from 'express';
    import { ApolloServer } from 'apollo-server-express';

    const app = express();
    app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }))
    const apolloServer = new ApolloServer({
      schema: '',
      context: ({ req, res }: Context) => ({req, res }),
    });

    apolloServer.applyMiddleware({ app, cors: false });
    app.listen(4000, () => console.log('express server started'));
    ```
    
---
### Cmd.
- server
```bash

typeorm init --name ./ --database postgres # 새 typeorm설정이 생성됨(tsconfig.json의 내용도 함께변하므로 인지)

```

- client

```

```
---
### Etc.
- [apollo-migration-boost](https://www.apollographql.com/docs/react/migrating/boost-migration/#gatsby-focus-wrapper)
- [apollo-link-token-refresh](https://github.com/newsiberian/apollo-link-token-refresh)

---
