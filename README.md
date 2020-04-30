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
  -
  - [x] type-graphql server init. 
  - [x] Resolver - EmailSignUp, Login
  - [ ] Resolver - EmailSignIn, JWT

- client
  - [ ]
  - [ ] 

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
```

- client
```bash

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

<p>

</p>
</details>
- client
---
### 5. Study.
- server
  - entry file에는 import "reflect-metadata"; 을 명시해주도록 하기(type-graphql의 decorator를 사용하기 위함)
  - @IsEmail()과 같이 이메일인지 확인하는 정규식 판단여부를 동작시키는 방법을 찾아야 됨.
  - Context를 가져오기 위해서는 ApolloServer에서 context를 반환해주는 메소드를 생성해주도록 해야함.
- client

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


---