
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model AgentDefinition
 * 
 */
export type AgentDefinition = $Result.DefaultSelection<Prisma.$AgentDefinitionPayload>
/**
 * Model AgentVersion
 * 
 */
export type AgentVersion = $Result.DefaultSelection<Prisma.$AgentVersionPayload>
/**
 * Model AgentRun
 * 
 */
export type AgentRun = $Result.DefaultSelection<Prisma.$AgentRunPayload>
/**
 * Model ConversationSession
 * 
 */
export type ConversationSession = $Result.DefaultSelection<Prisma.$ConversationSessionPayload>
/**
 * Model RunStep
 * 
 */
export type RunStep = $Result.DefaultSelection<Prisma.$RunStepPayload>
/**
 * Model RunArtifact
 * 
 */
export type RunArtifact = $Result.DefaultSelection<Prisma.$RunArtifactPayload>
/**
 * Model PrimitiveDefinition
 * 
 */
export type PrimitiveDefinition = $Result.DefaultSelection<Prisma.$PrimitiveDefinitionPayload>
/**
 * Model RunEval
 * 
 */
export type RunEval = $Result.DefaultSelection<Prisma.$RunEvalPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more AgentDefinitions
 * const agentDefinitions = await prisma.agentDefinition.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more AgentDefinitions
   * const agentDefinitions = await prisma.agentDefinition.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.agentDefinition`: Exposes CRUD operations for the **AgentDefinition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentDefinitions
    * const agentDefinitions = await prisma.agentDefinition.findMany()
    * ```
    */
  get agentDefinition(): Prisma.AgentDefinitionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentVersion`: Exposes CRUD operations for the **AgentVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentVersions
    * const agentVersions = await prisma.agentVersion.findMany()
    * ```
    */
  get agentVersion(): Prisma.AgentVersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentRun`: Exposes CRUD operations for the **AgentRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentRuns
    * const agentRuns = await prisma.agentRun.findMany()
    * ```
    */
  get agentRun(): Prisma.AgentRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.conversationSession`: Exposes CRUD operations for the **ConversationSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConversationSessions
    * const conversationSessions = await prisma.conversationSession.findMany()
    * ```
    */
  get conversationSession(): Prisma.ConversationSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.runStep`: Exposes CRUD operations for the **RunStep** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RunSteps
    * const runSteps = await prisma.runStep.findMany()
    * ```
    */
  get runStep(): Prisma.RunStepDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.runArtifact`: Exposes CRUD operations for the **RunArtifact** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RunArtifacts
    * const runArtifacts = await prisma.runArtifact.findMany()
    * ```
    */
  get runArtifact(): Prisma.RunArtifactDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.primitiveDefinition`: Exposes CRUD operations for the **PrimitiveDefinition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PrimitiveDefinitions
    * const primitiveDefinitions = await prisma.primitiveDefinition.findMany()
    * ```
    */
  get primitiveDefinition(): Prisma.PrimitiveDefinitionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.runEval`: Exposes CRUD operations for the **RunEval** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RunEvals
    * const runEvals = await prisma.runEval.findMany()
    * ```
    */
  get runEval(): Prisma.RunEvalDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    AgentDefinition: 'AgentDefinition',
    AgentVersion: 'AgentVersion',
    AgentRun: 'AgentRun',
    ConversationSession: 'ConversationSession',
    RunStep: 'RunStep',
    RunArtifact: 'RunArtifact',
    PrimitiveDefinition: 'PrimitiveDefinition',
    RunEval: 'RunEval'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "agentDefinition" | "agentVersion" | "agentRun" | "conversationSession" | "runStep" | "runArtifact" | "primitiveDefinition" | "runEval"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      AgentDefinition: {
        payload: Prisma.$AgentDefinitionPayload<ExtArgs>
        fields: Prisma.AgentDefinitionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentDefinitionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentDefinitionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentDefinitionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentDefinitionPayload>
          }
          findFirst: {
            args: Prisma.AgentDefinitionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentDefinitionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentDefinitionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentDefinitionPayload>
          }
          findMany: {
            args: Prisma.AgentDefinitionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentDefinitionPayload>[]
          }
          create: {
            args: Prisma.AgentDefinitionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentDefinitionPayload>
          }
          createMany: {
            args: Prisma.AgentDefinitionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentDefinitionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentDefinitionPayload>[]
          }
          delete: {
            args: Prisma.AgentDefinitionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentDefinitionPayload>
          }
          update: {
            args: Prisma.AgentDefinitionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentDefinitionPayload>
          }
          deleteMany: {
            args: Prisma.AgentDefinitionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentDefinitionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentDefinitionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentDefinitionPayload>[]
          }
          upsert: {
            args: Prisma.AgentDefinitionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentDefinitionPayload>
          }
          aggregate: {
            args: Prisma.AgentDefinitionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentDefinition>
          }
          groupBy: {
            args: Prisma.AgentDefinitionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentDefinitionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentDefinitionCountArgs<ExtArgs>
            result: $Utils.Optional<AgentDefinitionCountAggregateOutputType> | number
          }
        }
      }
      AgentVersion: {
        payload: Prisma.$AgentVersionPayload<ExtArgs>
        fields: Prisma.AgentVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentVersionPayload>
          }
          findFirst: {
            args: Prisma.AgentVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentVersionPayload>
          }
          findMany: {
            args: Prisma.AgentVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentVersionPayload>[]
          }
          create: {
            args: Prisma.AgentVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentVersionPayload>
          }
          createMany: {
            args: Prisma.AgentVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentVersionPayload>[]
          }
          delete: {
            args: Prisma.AgentVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentVersionPayload>
          }
          update: {
            args: Prisma.AgentVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentVersionPayload>
          }
          deleteMany: {
            args: Prisma.AgentVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentVersionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentVersionPayload>[]
          }
          upsert: {
            args: Prisma.AgentVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentVersionPayload>
          }
          aggregate: {
            args: Prisma.AgentVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentVersion>
          }
          groupBy: {
            args: Prisma.AgentVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentVersionCountArgs<ExtArgs>
            result: $Utils.Optional<AgentVersionCountAggregateOutputType> | number
          }
        }
      }
      AgentRun: {
        payload: Prisma.$AgentRunPayload<ExtArgs>
        fields: Prisma.AgentRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          findFirst: {
            args: Prisma.AgentRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          findMany: {
            args: Prisma.AgentRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>[]
          }
          create: {
            args: Prisma.AgentRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          createMany: {
            args: Prisma.AgentRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>[]
          }
          delete: {
            args: Prisma.AgentRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          update: {
            args: Prisma.AgentRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          deleteMany: {
            args: Prisma.AgentRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>[]
          }
          upsert: {
            args: Prisma.AgentRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          aggregate: {
            args: Prisma.AgentRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentRun>
          }
          groupBy: {
            args: Prisma.AgentRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentRunCountArgs<ExtArgs>
            result: $Utils.Optional<AgentRunCountAggregateOutputType> | number
          }
        }
      }
      ConversationSession: {
        payload: Prisma.$ConversationSessionPayload<ExtArgs>
        fields: Prisma.ConversationSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversationSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversationSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>
          }
          findFirst: {
            args: Prisma.ConversationSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversationSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>
          }
          findMany: {
            args: Prisma.ConversationSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>[]
          }
          create: {
            args: Prisma.ConversationSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>
          }
          createMany: {
            args: Prisma.ConversationSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConversationSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>[]
          }
          delete: {
            args: Prisma.ConversationSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>
          }
          update: {
            args: Prisma.ConversationSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>
          }
          deleteMany: {
            args: Prisma.ConversationSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversationSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConversationSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>[]
          }
          upsert: {
            args: Prisma.ConversationSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>
          }
          aggregate: {
            args: Prisma.ConversationSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversationSession>
          }
          groupBy: {
            args: Prisma.ConversationSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversationSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConversationSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ConversationSessionCountAggregateOutputType> | number
          }
        }
      }
      RunStep: {
        payload: Prisma.$RunStepPayload<ExtArgs>
        fields: Prisma.RunStepFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RunStepFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunStepPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RunStepFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunStepPayload>
          }
          findFirst: {
            args: Prisma.RunStepFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunStepPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RunStepFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunStepPayload>
          }
          findMany: {
            args: Prisma.RunStepFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunStepPayload>[]
          }
          create: {
            args: Prisma.RunStepCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunStepPayload>
          }
          createMany: {
            args: Prisma.RunStepCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RunStepCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunStepPayload>[]
          }
          delete: {
            args: Prisma.RunStepDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunStepPayload>
          }
          update: {
            args: Prisma.RunStepUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunStepPayload>
          }
          deleteMany: {
            args: Prisma.RunStepDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RunStepUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RunStepUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunStepPayload>[]
          }
          upsert: {
            args: Prisma.RunStepUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunStepPayload>
          }
          aggregate: {
            args: Prisma.RunStepAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRunStep>
          }
          groupBy: {
            args: Prisma.RunStepGroupByArgs<ExtArgs>
            result: $Utils.Optional<RunStepGroupByOutputType>[]
          }
          count: {
            args: Prisma.RunStepCountArgs<ExtArgs>
            result: $Utils.Optional<RunStepCountAggregateOutputType> | number
          }
        }
      }
      RunArtifact: {
        payload: Prisma.$RunArtifactPayload<ExtArgs>
        fields: Prisma.RunArtifactFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RunArtifactFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunArtifactPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RunArtifactFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunArtifactPayload>
          }
          findFirst: {
            args: Prisma.RunArtifactFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunArtifactPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RunArtifactFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunArtifactPayload>
          }
          findMany: {
            args: Prisma.RunArtifactFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunArtifactPayload>[]
          }
          create: {
            args: Prisma.RunArtifactCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunArtifactPayload>
          }
          createMany: {
            args: Prisma.RunArtifactCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RunArtifactCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunArtifactPayload>[]
          }
          delete: {
            args: Prisma.RunArtifactDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunArtifactPayload>
          }
          update: {
            args: Prisma.RunArtifactUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunArtifactPayload>
          }
          deleteMany: {
            args: Prisma.RunArtifactDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RunArtifactUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RunArtifactUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunArtifactPayload>[]
          }
          upsert: {
            args: Prisma.RunArtifactUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunArtifactPayload>
          }
          aggregate: {
            args: Prisma.RunArtifactAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRunArtifact>
          }
          groupBy: {
            args: Prisma.RunArtifactGroupByArgs<ExtArgs>
            result: $Utils.Optional<RunArtifactGroupByOutputType>[]
          }
          count: {
            args: Prisma.RunArtifactCountArgs<ExtArgs>
            result: $Utils.Optional<RunArtifactCountAggregateOutputType> | number
          }
        }
      }
      PrimitiveDefinition: {
        payload: Prisma.$PrimitiveDefinitionPayload<ExtArgs>
        fields: Prisma.PrimitiveDefinitionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PrimitiveDefinitionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrimitiveDefinitionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PrimitiveDefinitionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrimitiveDefinitionPayload>
          }
          findFirst: {
            args: Prisma.PrimitiveDefinitionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrimitiveDefinitionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PrimitiveDefinitionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrimitiveDefinitionPayload>
          }
          findMany: {
            args: Prisma.PrimitiveDefinitionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrimitiveDefinitionPayload>[]
          }
          create: {
            args: Prisma.PrimitiveDefinitionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrimitiveDefinitionPayload>
          }
          createMany: {
            args: Prisma.PrimitiveDefinitionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PrimitiveDefinitionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrimitiveDefinitionPayload>[]
          }
          delete: {
            args: Prisma.PrimitiveDefinitionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrimitiveDefinitionPayload>
          }
          update: {
            args: Prisma.PrimitiveDefinitionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrimitiveDefinitionPayload>
          }
          deleteMany: {
            args: Prisma.PrimitiveDefinitionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PrimitiveDefinitionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PrimitiveDefinitionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrimitiveDefinitionPayload>[]
          }
          upsert: {
            args: Prisma.PrimitiveDefinitionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrimitiveDefinitionPayload>
          }
          aggregate: {
            args: Prisma.PrimitiveDefinitionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrimitiveDefinition>
          }
          groupBy: {
            args: Prisma.PrimitiveDefinitionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PrimitiveDefinitionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PrimitiveDefinitionCountArgs<ExtArgs>
            result: $Utils.Optional<PrimitiveDefinitionCountAggregateOutputType> | number
          }
        }
      }
      RunEval: {
        payload: Prisma.$RunEvalPayload<ExtArgs>
        fields: Prisma.RunEvalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RunEvalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunEvalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RunEvalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunEvalPayload>
          }
          findFirst: {
            args: Prisma.RunEvalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunEvalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RunEvalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunEvalPayload>
          }
          findMany: {
            args: Prisma.RunEvalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunEvalPayload>[]
          }
          create: {
            args: Prisma.RunEvalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunEvalPayload>
          }
          createMany: {
            args: Prisma.RunEvalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RunEvalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunEvalPayload>[]
          }
          delete: {
            args: Prisma.RunEvalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunEvalPayload>
          }
          update: {
            args: Prisma.RunEvalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunEvalPayload>
          }
          deleteMany: {
            args: Prisma.RunEvalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RunEvalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RunEvalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunEvalPayload>[]
          }
          upsert: {
            args: Prisma.RunEvalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunEvalPayload>
          }
          aggregate: {
            args: Prisma.RunEvalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRunEval>
          }
          groupBy: {
            args: Prisma.RunEvalGroupByArgs<ExtArgs>
            result: $Utils.Optional<RunEvalGroupByOutputType>[]
          }
          count: {
            args: Prisma.RunEvalCountArgs<ExtArgs>
            result: $Utils.Optional<RunEvalCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    agentDefinition?: AgentDefinitionOmit
    agentVersion?: AgentVersionOmit
    agentRun?: AgentRunOmit
    conversationSession?: ConversationSessionOmit
    runStep?: RunStepOmit
    runArtifact?: RunArtifactOmit
    primitiveDefinition?: PrimitiveDefinitionOmit
    runEval?: RunEvalOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AgentDefinitionCountOutputType
   */

  export type AgentDefinitionCountOutputType = {
    versions: number
    runs: number
    sessions: number
  }

  export type AgentDefinitionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | AgentDefinitionCountOutputTypeCountVersionsArgs
    runs?: boolean | AgentDefinitionCountOutputTypeCountRunsArgs
    sessions?: boolean | AgentDefinitionCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * AgentDefinitionCountOutputType without action
   */
  export type AgentDefinitionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinitionCountOutputType
     */
    select?: AgentDefinitionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AgentDefinitionCountOutputType without action
   */
  export type AgentDefinitionCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentVersionWhereInput
  }

  /**
   * AgentDefinitionCountOutputType without action
   */
  export type AgentDefinitionCountOutputTypeCountRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentRunWhereInput
  }

  /**
   * AgentDefinitionCountOutputType without action
   */
  export type AgentDefinitionCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationSessionWhereInput
  }


  /**
   * Count Type AgentRunCountOutputType
   */

  export type AgentRunCountOutputType = {
    steps: number
    artifacts: number
    evals: number
  }

  export type AgentRunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    steps?: boolean | AgentRunCountOutputTypeCountStepsArgs
    artifacts?: boolean | AgentRunCountOutputTypeCountArtifactsArgs
    evals?: boolean | AgentRunCountOutputTypeCountEvalsArgs
  }

  // Custom InputTypes
  /**
   * AgentRunCountOutputType without action
   */
  export type AgentRunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRunCountOutputType
     */
    select?: AgentRunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AgentRunCountOutputType without action
   */
  export type AgentRunCountOutputTypeCountStepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RunStepWhereInput
  }

  /**
   * AgentRunCountOutputType without action
   */
  export type AgentRunCountOutputTypeCountArtifactsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RunArtifactWhereInput
  }

  /**
   * AgentRunCountOutputType without action
   */
  export type AgentRunCountOutputTypeCountEvalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RunEvalWhereInput
  }


  /**
   * Count Type ConversationSessionCountOutputType
   */

  export type ConversationSessionCountOutputType = {
    runs: number
  }

  export type ConversationSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    runs?: boolean | ConversationSessionCountOutputTypeCountRunsArgs
  }

  // Custom InputTypes
  /**
   * ConversationSessionCountOutputType without action
   */
  export type ConversationSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSessionCountOutputType
     */
    select?: ConversationSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConversationSessionCountOutputType without action
   */
  export type ConversationSessionCountOutputTypeCountRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentRunWhereInput
  }


  /**
   * Models
   */

  /**
   * Model AgentDefinition
   */

  export type AggregateAgentDefinition = {
    _count: AgentDefinitionCountAggregateOutputType | null
    _min: AgentDefinitionMinAggregateOutputType | null
    _max: AgentDefinitionMaxAggregateOutputType | null
  }

  export type AgentDefinitionMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    description: string | null
    kind: string | null
    instructions: string | null
    defaultModel: string | null
    mode: string | null
    publishToken: string | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgentDefinitionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    description: string | null
    kind: string | null
    instructions: string | null
    defaultModel: string | null
    mode: string | null
    publishToken: string | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgentDefinitionCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    description: number
    kind: number
    instructions: number
    allowedTools: number
    defaultModel: number
    outputSchema: number
    flowDefinition: number
    mode: number
    publishToken: number
    publishedAt: number
    meta: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AgentDefinitionMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    kind?: true
    instructions?: true
    defaultModel?: true
    mode?: true
    publishToken?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgentDefinitionMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    kind?: true
    instructions?: true
    defaultModel?: true
    mode?: true
    publishToken?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgentDefinitionCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    kind?: true
    instructions?: true
    allowedTools?: true
    defaultModel?: true
    outputSchema?: true
    flowDefinition?: true
    mode?: true
    publishToken?: true
    publishedAt?: true
    meta?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AgentDefinitionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentDefinition to aggregate.
     */
    where?: AgentDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentDefinitions to fetch.
     */
    orderBy?: AgentDefinitionOrderByWithRelationInput | AgentDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentDefinitions
    **/
    _count?: true | AgentDefinitionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentDefinitionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentDefinitionMaxAggregateInputType
  }

  export type GetAgentDefinitionAggregateType<T extends AgentDefinitionAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentDefinition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentDefinition[P]>
      : GetScalarType<T[P], AggregateAgentDefinition[P]>
  }




  export type AgentDefinitionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentDefinitionWhereInput
    orderBy?: AgentDefinitionOrderByWithAggregationInput | AgentDefinitionOrderByWithAggregationInput[]
    by: AgentDefinitionScalarFieldEnum[] | AgentDefinitionScalarFieldEnum
    having?: AgentDefinitionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentDefinitionCountAggregateInputType | true
    _min?: AgentDefinitionMinAggregateInputType
    _max?: AgentDefinitionMaxAggregateInputType
  }

  export type AgentDefinitionGroupByOutputType = {
    id: string
    name: string
    slug: string
    description: string
    kind: string
    instructions: string
    allowedTools: JsonValue
    defaultModel: string
    outputSchema: JsonValue | null
    flowDefinition: JsonValue | null
    mode: string
    publishToken: string | null
    publishedAt: Date | null
    meta: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: AgentDefinitionCountAggregateOutputType | null
    _min: AgentDefinitionMinAggregateOutputType | null
    _max: AgentDefinitionMaxAggregateOutputType | null
  }

  type GetAgentDefinitionGroupByPayload<T extends AgentDefinitionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentDefinitionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentDefinitionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentDefinitionGroupByOutputType[P]>
            : GetScalarType<T[P], AgentDefinitionGroupByOutputType[P]>
        }
      >
    >


  export type AgentDefinitionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    kind?: boolean
    instructions?: boolean
    allowedTools?: boolean
    defaultModel?: boolean
    outputSchema?: boolean
    flowDefinition?: boolean
    mode?: boolean
    publishToken?: boolean
    publishedAt?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    versions?: boolean | AgentDefinition$versionsArgs<ExtArgs>
    runs?: boolean | AgentDefinition$runsArgs<ExtArgs>
    sessions?: boolean | AgentDefinition$sessionsArgs<ExtArgs>
    _count?: boolean | AgentDefinitionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentDefinition"]>

  export type AgentDefinitionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    kind?: boolean
    instructions?: boolean
    allowedTools?: boolean
    defaultModel?: boolean
    outputSchema?: boolean
    flowDefinition?: boolean
    mode?: boolean
    publishToken?: boolean
    publishedAt?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["agentDefinition"]>

  export type AgentDefinitionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    kind?: boolean
    instructions?: boolean
    allowedTools?: boolean
    defaultModel?: boolean
    outputSchema?: boolean
    flowDefinition?: boolean
    mode?: boolean
    publishToken?: boolean
    publishedAt?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["agentDefinition"]>

  export type AgentDefinitionSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    kind?: boolean
    instructions?: boolean
    allowedTools?: boolean
    defaultModel?: boolean
    outputSchema?: boolean
    flowDefinition?: boolean
    mode?: boolean
    publishToken?: boolean
    publishedAt?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AgentDefinitionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "description" | "kind" | "instructions" | "allowedTools" | "defaultModel" | "outputSchema" | "flowDefinition" | "mode" | "publishToken" | "publishedAt" | "meta" | "createdAt" | "updatedAt", ExtArgs["result"]["agentDefinition"]>
  export type AgentDefinitionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | AgentDefinition$versionsArgs<ExtArgs>
    runs?: boolean | AgentDefinition$runsArgs<ExtArgs>
    sessions?: boolean | AgentDefinition$sessionsArgs<ExtArgs>
    _count?: boolean | AgentDefinitionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AgentDefinitionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AgentDefinitionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AgentDefinitionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentDefinition"
    objects: {
      versions: Prisma.$AgentVersionPayload<ExtArgs>[]
      runs: Prisma.$AgentRunPayload<ExtArgs>[]
      sessions: Prisma.$ConversationSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      description: string
      kind: string
      instructions: string
      allowedTools: Prisma.JsonValue
      defaultModel: string
      outputSchema: Prisma.JsonValue | null
      flowDefinition: Prisma.JsonValue | null
      mode: string
      publishToken: string | null
      publishedAt: Date | null
      meta: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["agentDefinition"]>
    composites: {}
  }

  type AgentDefinitionGetPayload<S extends boolean | null | undefined | AgentDefinitionDefaultArgs> = $Result.GetResult<Prisma.$AgentDefinitionPayload, S>

  type AgentDefinitionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentDefinitionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentDefinitionCountAggregateInputType | true
    }

  export interface AgentDefinitionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentDefinition'], meta: { name: 'AgentDefinition' } }
    /**
     * Find zero or one AgentDefinition that matches the filter.
     * @param {AgentDefinitionFindUniqueArgs} args - Arguments to find a AgentDefinition
     * @example
     * // Get one AgentDefinition
     * const agentDefinition = await prisma.agentDefinition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentDefinitionFindUniqueArgs>(args: SelectSubset<T, AgentDefinitionFindUniqueArgs<ExtArgs>>): Prisma__AgentDefinitionClient<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentDefinition that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentDefinitionFindUniqueOrThrowArgs} args - Arguments to find a AgentDefinition
     * @example
     * // Get one AgentDefinition
     * const agentDefinition = await prisma.agentDefinition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentDefinitionFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentDefinitionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentDefinitionClient<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentDefinition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentDefinitionFindFirstArgs} args - Arguments to find a AgentDefinition
     * @example
     * // Get one AgentDefinition
     * const agentDefinition = await prisma.agentDefinition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentDefinitionFindFirstArgs>(args?: SelectSubset<T, AgentDefinitionFindFirstArgs<ExtArgs>>): Prisma__AgentDefinitionClient<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentDefinition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentDefinitionFindFirstOrThrowArgs} args - Arguments to find a AgentDefinition
     * @example
     * // Get one AgentDefinition
     * const agentDefinition = await prisma.agentDefinition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentDefinitionFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentDefinitionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentDefinitionClient<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentDefinitions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentDefinitionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentDefinitions
     * const agentDefinitions = await prisma.agentDefinition.findMany()
     * 
     * // Get first 10 AgentDefinitions
     * const agentDefinitions = await prisma.agentDefinition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentDefinitionWithIdOnly = await prisma.agentDefinition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentDefinitionFindManyArgs>(args?: SelectSubset<T, AgentDefinitionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentDefinition.
     * @param {AgentDefinitionCreateArgs} args - Arguments to create a AgentDefinition.
     * @example
     * // Create one AgentDefinition
     * const AgentDefinition = await prisma.agentDefinition.create({
     *   data: {
     *     // ... data to create a AgentDefinition
     *   }
     * })
     * 
     */
    create<T extends AgentDefinitionCreateArgs>(args: SelectSubset<T, AgentDefinitionCreateArgs<ExtArgs>>): Prisma__AgentDefinitionClient<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentDefinitions.
     * @param {AgentDefinitionCreateManyArgs} args - Arguments to create many AgentDefinitions.
     * @example
     * // Create many AgentDefinitions
     * const agentDefinition = await prisma.agentDefinition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentDefinitionCreateManyArgs>(args?: SelectSubset<T, AgentDefinitionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentDefinitions and returns the data saved in the database.
     * @param {AgentDefinitionCreateManyAndReturnArgs} args - Arguments to create many AgentDefinitions.
     * @example
     * // Create many AgentDefinitions
     * const agentDefinition = await prisma.agentDefinition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentDefinitions and only return the `id`
     * const agentDefinitionWithIdOnly = await prisma.agentDefinition.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentDefinitionCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentDefinitionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentDefinition.
     * @param {AgentDefinitionDeleteArgs} args - Arguments to delete one AgentDefinition.
     * @example
     * // Delete one AgentDefinition
     * const AgentDefinition = await prisma.agentDefinition.delete({
     *   where: {
     *     // ... filter to delete one AgentDefinition
     *   }
     * })
     * 
     */
    delete<T extends AgentDefinitionDeleteArgs>(args: SelectSubset<T, AgentDefinitionDeleteArgs<ExtArgs>>): Prisma__AgentDefinitionClient<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentDefinition.
     * @param {AgentDefinitionUpdateArgs} args - Arguments to update one AgentDefinition.
     * @example
     * // Update one AgentDefinition
     * const agentDefinition = await prisma.agentDefinition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentDefinitionUpdateArgs>(args: SelectSubset<T, AgentDefinitionUpdateArgs<ExtArgs>>): Prisma__AgentDefinitionClient<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentDefinitions.
     * @param {AgentDefinitionDeleteManyArgs} args - Arguments to filter AgentDefinitions to delete.
     * @example
     * // Delete a few AgentDefinitions
     * const { count } = await prisma.agentDefinition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentDefinitionDeleteManyArgs>(args?: SelectSubset<T, AgentDefinitionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentDefinitionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentDefinitions
     * const agentDefinition = await prisma.agentDefinition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentDefinitionUpdateManyArgs>(args: SelectSubset<T, AgentDefinitionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentDefinitions and returns the data updated in the database.
     * @param {AgentDefinitionUpdateManyAndReturnArgs} args - Arguments to update many AgentDefinitions.
     * @example
     * // Update many AgentDefinitions
     * const agentDefinition = await prisma.agentDefinition.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentDefinitions and only return the `id`
     * const agentDefinitionWithIdOnly = await prisma.agentDefinition.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentDefinitionUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentDefinitionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentDefinition.
     * @param {AgentDefinitionUpsertArgs} args - Arguments to update or create a AgentDefinition.
     * @example
     * // Update or create a AgentDefinition
     * const agentDefinition = await prisma.agentDefinition.upsert({
     *   create: {
     *     // ... data to create a AgentDefinition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentDefinition we want to update
     *   }
     * })
     */
    upsert<T extends AgentDefinitionUpsertArgs>(args: SelectSubset<T, AgentDefinitionUpsertArgs<ExtArgs>>): Prisma__AgentDefinitionClient<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentDefinitionCountArgs} args - Arguments to filter AgentDefinitions to count.
     * @example
     * // Count the number of AgentDefinitions
     * const count = await prisma.agentDefinition.count({
     *   where: {
     *     // ... the filter for the AgentDefinitions we want to count
     *   }
     * })
    **/
    count<T extends AgentDefinitionCountArgs>(
      args?: Subset<T, AgentDefinitionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentDefinitionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentDefinitionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentDefinitionAggregateArgs>(args: Subset<T, AgentDefinitionAggregateArgs>): Prisma.PrismaPromise<GetAgentDefinitionAggregateType<T>>

    /**
     * Group by AgentDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentDefinitionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentDefinitionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentDefinitionGroupByArgs['orderBy'] }
        : { orderBy?: AgentDefinitionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentDefinitionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentDefinitionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentDefinition model
   */
  readonly fields: AgentDefinitionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentDefinition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentDefinitionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    versions<T extends AgentDefinition$versionsArgs<ExtArgs> = {}>(args?: Subset<T, AgentDefinition$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    runs<T extends AgentDefinition$runsArgs<ExtArgs> = {}>(args?: Subset<T, AgentDefinition$runsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends AgentDefinition$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, AgentDefinition$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentDefinition model
   */
  interface AgentDefinitionFieldRefs {
    readonly id: FieldRef<"AgentDefinition", 'String'>
    readonly name: FieldRef<"AgentDefinition", 'String'>
    readonly slug: FieldRef<"AgentDefinition", 'String'>
    readonly description: FieldRef<"AgentDefinition", 'String'>
    readonly kind: FieldRef<"AgentDefinition", 'String'>
    readonly instructions: FieldRef<"AgentDefinition", 'String'>
    readonly allowedTools: FieldRef<"AgentDefinition", 'Json'>
    readonly defaultModel: FieldRef<"AgentDefinition", 'String'>
    readonly outputSchema: FieldRef<"AgentDefinition", 'Json'>
    readonly flowDefinition: FieldRef<"AgentDefinition", 'Json'>
    readonly mode: FieldRef<"AgentDefinition", 'String'>
    readonly publishToken: FieldRef<"AgentDefinition", 'String'>
    readonly publishedAt: FieldRef<"AgentDefinition", 'DateTime'>
    readonly meta: FieldRef<"AgentDefinition", 'Json'>
    readonly createdAt: FieldRef<"AgentDefinition", 'DateTime'>
    readonly updatedAt: FieldRef<"AgentDefinition", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentDefinition findUnique
   */
  export type AgentDefinitionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinition
     */
    select?: AgentDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentDefinition
     */
    omit?: AgentDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which AgentDefinition to fetch.
     */
    where: AgentDefinitionWhereUniqueInput
  }

  /**
   * AgentDefinition findUniqueOrThrow
   */
  export type AgentDefinitionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinition
     */
    select?: AgentDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentDefinition
     */
    omit?: AgentDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which AgentDefinition to fetch.
     */
    where: AgentDefinitionWhereUniqueInput
  }

  /**
   * AgentDefinition findFirst
   */
  export type AgentDefinitionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinition
     */
    select?: AgentDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentDefinition
     */
    omit?: AgentDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which AgentDefinition to fetch.
     */
    where?: AgentDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentDefinitions to fetch.
     */
    orderBy?: AgentDefinitionOrderByWithRelationInput | AgentDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentDefinitions.
     */
    cursor?: AgentDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentDefinitions.
     */
    distinct?: AgentDefinitionScalarFieldEnum | AgentDefinitionScalarFieldEnum[]
  }

  /**
   * AgentDefinition findFirstOrThrow
   */
  export type AgentDefinitionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinition
     */
    select?: AgentDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentDefinition
     */
    omit?: AgentDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which AgentDefinition to fetch.
     */
    where?: AgentDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentDefinitions to fetch.
     */
    orderBy?: AgentDefinitionOrderByWithRelationInput | AgentDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentDefinitions.
     */
    cursor?: AgentDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentDefinitions.
     */
    distinct?: AgentDefinitionScalarFieldEnum | AgentDefinitionScalarFieldEnum[]
  }

  /**
   * AgentDefinition findMany
   */
  export type AgentDefinitionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinition
     */
    select?: AgentDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentDefinition
     */
    omit?: AgentDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which AgentDefinitions to fetch.
     */
    where?: AgentDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentDefinitions to fetch.
     */
    orderBy?: AgentDefinitionOrderByWithRelationInput | AgentDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentDefinitions.
     */
    cursor?: AgentDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentDefinitions.
     */
    distinct?: AgentDefinitionScalarFieldEnum | AgentDefinitionScalarFieldEnum[]
  }

  /**
   * AgentDefinition create
   */
  export type AgentDefinitionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinition
     */
    select?: AgentDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentDefinition
     */
    omit?: AgentDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentDefinitionInclude<ExtArgs> | null
    /**
     * The data needed to create a AgentDefinition.
     */
    data: XOR<AgentDefinitionCreateInput, AgentDefinitionUncheckedCreateInput>
  }

  /**
   * AgentDefinition createMany
   */
  export type AgentDefinitionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentDefinitions.
     */
    data: AgentDefinitionCreateManyInput | AgentDefinitionCreateManyInput[]
  }

  /**
   * AgentDefinition createManyAndReturn
   */
  export type AgentDefinitionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinition
     */
    select?: AgentDefinitionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentDefinition
     */
    omit?: AgentDefinitionOmit<ExtArgs> | null
    /**
     * The data used to create many AgentDefinitions.
     */
    data: AgentDefinitionCreateManyInput | AgentDefinitionCreateManyInput[]
  }

  /**
   * AgentDefinition update
   */
  export type AgentDefinitionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinition
     */
    select?: AgentDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentDefinition
     */
    omit?: AgentDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentDefinitionInclude<ExtArgs> | null
    /**
     * The data needed to update a AgentDefinition.
     */
    data: XOR<AgentDefinitionUpdateInput, AgentDefinitionUncheckedUpdateInput>
    /**
     * Choose, which AgentDefinition to update.
     */
    where: AgentDefinitionWhereUniqueInput
  }

  /**
   * AgentDefinition updateMany
   */
  export type AgentDefinitionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentDefinitions.
     */
    data: XOR<AgentDefinitionUpdateManyMutationInput, AgentDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which AgentDefinitions to update
     */
    where?: AgentDefinitionWhereInput
    /**
     * Limit how many AgentDefinitions to update.
     */
    limit?: number
  }

  /**
   * AgentDefinition updateManyAndReturn
   */
  export type AgentDefinitionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinition
     */
    select?: AgentDefinitionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentDefinition
     */
    omit?: AgentDefinitionOmit<ExtArgs> | null
    /**
     * The data used to update AgentDefinitions.
     */
    data: XOR<AgentDefinitionUpdateManyMutationInput, AgentDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which AgentDefinitions to update
     */
    where?: AgentDefinitionWhereInput
    /**
     * Limit how many AgentDefinitions to update.
     */
    limit?: number
  }

  /**
   * AgentDefinition upsert
   */
  export type AgentDefinitionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinition
     */
    select?: AgentDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentDefinition
     */
    omit?: AgentDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentDefinitionInclude<ExtArgs> | null
    /**
     * The filter to search for the AgentDefinition to update in case it exists.
     */
    where: AgentDefinitionWhereUniqueInput
    /**
     * In case the AgentDefinition found by the `where` argument doesn't exist, create a new AgentDefinition with this data.
     */
    create: XOR<AgentDefinitionCreateInput, AgentDefinitionUncheckedCreateInput>
    /**
     * In case the AgentDefinition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentDefinitionUpdateInput, AgentDefinitionUncheckedUpdateInput>
  }

  /**
   * AgentDefinition delete
   */
  export type AgentDefinitionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinition
     */
    select?: AgentDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentDefinition
     */
    omit?: AgentDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentDefinitionInclude<ExtArgs> | null
    /**
     * Filter which AgentDefinition to delete.
     */
    where: AgentDefinitionWhereUniqueInput
  }

  /**
   * AgentDefinition deleteMany
   */
  export type AgentDefinitionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentDefinitions to delete
     */
    where?: AgentDefinitionWhereInput
    /**
     * Limit how many AgentDefinitions to delete.
     */
    limit?: number
  }

  /**
   * AgentDefinition.versions
   */
  export type AgentDefinition$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionInclude<ExtArgs> | null
    where?: AgentVersionWhereInput
    orderBy?: AgentVersionOrderByWithRelationInput | AgentVersionOrderByWithRelationInput[]
    cursor?: AgentVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgentVersionScalarFieldEnum | AgentVersionScalarFieldEnum[]
  }

  /**
   * AgentDefinition.runs
   */
  export type AgentDefinition$runsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    where?: AgentRunWhereInput
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    cursor?: AgentRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentDefinition.sessions
   */
  export type AgentDefinition$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    where?: ConversationSessionWhereInput
    orderBy?: ConversationSessionOrderByWithRelationInput | ConversationSessionOrderByWithRelationInput[]
    cursor?: ConversationSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConversationSessionScalarFieldEnum | ConversationSessionScalarFieldEnum[]
  }

  /**
   * AgentDefinition without action
   */
  export type AgentDefinitionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentDefinition
     */
    select?: AgentDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentDefinition
     */
    omit?: AgentDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentDefinitionInclude<ExtArgs> | null
  }


  /**
   * Model AgentVersion
   */

  export type AggregateAgentVersion = {
    _count: AgentVersionCountAggregateOutputType | null
    _avg: AgentVersionAvgAggregateOutputType | null
    _sum: AgentVersionSumAggregateOutputType | null
    _min: AgentVersionMinAggregateOutputType | null
    _max: AgentVersionMaxAggregateOutputType | null
  }

  export type AgentVersionAvgAggregateOutputType = {
    version: number | null
  }

  export type AgentVersionSumAggregateOutputType = {
    version: number | null
  }

  export type AgentVersionMinAggregateOutputType = {
    id: string | null
    agentDefinitionId: string | null
    version: number | null
    instructions: string | null
    defaultModel: string | null
    changelog: string | null
    createdAt: Date | null
  }

  export type AgentVersionMaxAggregateOutputType = {
    id: string | null
    agentDefinitionId: string | null
    version: number | null
    instructions: string | null
    defaultModel: string | null
    changelog: string | null
    createdAt: Date | null
  }

  export type AgentVersionCountAggregateOutputType = {
    id: number
    agentDefinitionId: number
    version: number
    instructions: number
    allowedTools: number
    defaultModel: number
    outputSchema: number
    flowDefinition: number
    changelog: number
    createdAt: number
    _all: number
  }


  export type AgentVersionAvgAggregateInputType = {
    version?: true
  }

  export type AgentVersionSumAggregateInputType = {
    version?: true
  }

  export type AgentVersionMinAggregateInputType = {
    id?: true
    agentDefinitionId?: true
    version?: true
    instructions?: true
    defaultModel?: true
    changelog?: true
    createdAt?: true
  }

  export type AgentVersionMaxAggregateInputType = {
    id?: true
    agentDefinitionId?: true
    version?: true
    instructions?: true
    defaultModel?: true
    changelog?: true
    createdAt?: true
  }

  export type AgentVersionCountAggregateInputType = {
    id?: true
    agentDefinitionId?: true
    version?: true
    instructions?: true
    allowedTools?: true
    defaultModel?: true
    outputSchema?: true
    flowDefinition?: true
    changelog?: true
    createdAt?: true
    _all?: true
  }

  export type AgentVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentVersion to aggregate.
     */
    where?: AgentVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentVersions to fetch.
     */
    orderBy?: AgentVersionOrderByWithRelationInput | AgentVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentVersions
    **/
    _count?: true | AgentVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AgentVersionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AgentVersionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentVersionMaxAggregateInputType
  }

  export type GetAgentVersionAggregateType<T extends AgentVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentVersion[P]>
      : GetScalarType<T[P], AggregateAgentVersion[P]>
  }




  export type AgentVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentVersionWhereInput
    orderBy?: AgentVersionOrderByWithAggregationInput | AgentVersionOrderByWithAggregationInput[]
    by: AgentVersionScalarFieldEnum[] | AgentVersionScalarFieldEnum
    having?: AgentVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentVersionCountAggregateInputType | true
    _avg?: AgentVersionAvgAggregateInputType
    _sum?: AgentVersionSumAggregateInputType
    _min?: AgentVersionMinAggregateInputType
    _max?: AgentVersionMaxAggregateInputType
  }

  export type AgentVersionGroupByOutputType = {
    id: string
    agentDefinitionId: string
    version: number
    instructions: string
    allowedTools: JsonValue
    defaultModel: string
    outputSchema: JsonValue | null
    flowDefinition: JsonValue | null
    changelog: string
    createdAt: Date
    _count: AgentVersionCountAggregateOutputType | null
    _avg: AgentVersionAvgAggregateOutputType | null
    _sum: AgentVersionSumAggregateOutputType | null
    _min: AgentVersionMinAggregateOutputType | null
    _max: AgentVersionMaxAggregateOutputType | null
  }

  type GetAgentVersionGroupByPayload<T extends AgentVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentVersionGroupByOutputType[P]>
            : GetScalarType<T[P], AgentVersionGroupByOutputType[P]>
        }
      >
    >


  export type AgentVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentDefinitionId?: boolean
    version?: boolean
    instructions?: boolean
    allowedTools?: boolean
    defaultModel?: boolean
    outputSchema?: boolean
    flowDefinition?: boolean
    changelog?: boolean
    createdAt?: boolean
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentVersion"]>

  export type AgentVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentDefinitionId?: boolean
    version?: boolean
    instructions?: boolean
    allowedTools?: boolean
    defaultModel?: boolean
    outputSchema?: boolean
    flowDefinition?: boolean
    changelog?: boolean
    createdAt?: boolean
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentVersion"]>

  export type AgentVersionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentDefinitionId?: boolean
    version?: boolean
    instructions?: boolean
    allowedTools?: boolean
    defaultModel?: boolean
    outputSchema?: boolean
    flowDefinition?: boolean
    changelog?: boolean
    createdAt?: boolean
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentVersion"]>

  export type AgentVersionSelectScalar = {
    id?: boolean
    agentDefinitionId?: boolean
    version?: boolean
    instructions?: boolean
    allowedTools?: boolean
    defaultModel?: boolean
    outputSchema?: boolean
    flowDefinition?: boolean
    changelog?: boolean
    createdAt?: boolean
  }

  export type AgentVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "agentDefinitionId" | "version" | "instructions" | "allowedTools" | "defaultModel" | "outputSchema" | "flowDefinition" | "changelog" | "createdAt", ExtArgs["result"]["agentVersion"]>
  export type AgentVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
  }
  export type AgentVersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
  }
  export type AgentVersionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
  }

  export type $AgentVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentVersion"
    objects: {
      agentDefinition: Prisma.$AgentDefinitionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agentDefinitionId: string
      version: number
      instructions: string
      allowedTools: Prisma.JsonValue
      defaultModel: string
      outputSchema: Prisma.JsonValue | null
      flowDefinition: Prisma.JsonValue | null
      changelog: string
      createdAt: Date
    }, ExtArgs["result"]["agentVersion"]>
    composites: {}
  }

  type AgentVersionGetPayload<S extends boolean | null | undefined | AgentVersionDefaultArgs> = $Result.GetResult<Prisma.$AgentVersionPayload, S>

  type AgentVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentVersionCountAggregateInputType | true
    }

  export interface AgentVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentVersion'], meta: { name: 'AgentVersion' } }
    /**
     * Find zero or one AgentVersion that matches the filter.
     * @param {AgentVersionFindUniqueArgs} args - Arguments to find a AgentVersion
     * @example
     * // Get one AgentVersion
     * const agentVersion = await prisma.agentVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentVersionFindUniqueArgs>(args: SelectSubset<T, AgentVersionFindUniqueArgs<ExtArgs>>): Prisma__AgentVersionClient<$Result.GetResult<Prisma.$AgentVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentVersionFindUniqueOrThrowArgs} args - Arguments to find a AgentVersion
     * @example
     * // Get one AgentVersion
     * const agentVersion = await prisma.agentVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentVersionClient<$Result.GetResult<Prisma.$AgentVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentVersionFindFirstArgs} args - Arguments to find a AgentVersion
     * @example
     * // Get one AgentVersion
     * const agentVersion = await prisma.agentVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentVersionFindFirstArgs>(args?: SelectSubset<T, AgentVersionFindFirstArgs<ExtArgs>>): Prisma__AgentVersionClient<$Result.GetResult<Prisma.$AgentVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentVersionFindFirstOrThrowArgs} args - Arguments to find a AgentVersion
     * @example
     * // Get one AgentVersion
     * const agentVersion = await prisma.agentVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentVersionClient<$Result.GetResult<Prisma.$AgentVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentVersions
     * const agentVersions = await prisma.agentVersion.findMany()
     * 
     * // Get first 10 AgentVersions
     * const agentVersions = await prisma.agentVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentVersionWithIdOnly = await prisma.agentVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentVersionFindManyArgs>(args?: SelectSubset<T, AgentVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentVersion.
     * @param {AgentVersionCreateArgs} args - Arguments to create a AgentVersion.
     * @example
     * // Create one AgentVersion
     * const AgentVersion = await prisma.agentVersion.create({
     *   data: {
     *     // ... data to create a AgentVersion
     *   }
     * })
     * 
     */
    create<T extends AgentVersionCreateArgs>(args: SelectSubset<T, AgentVersionCreateArgs<ExtArgs>>): Prisma__AgentVersionClient<$Result.GetResult<Prisma.$AgentVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentVersions.
     * @param {AgentVersionCreateManyArgs} args - Arguments to create many AgentVersions.
     * @example
     * // Create many AgentVersions
     * const agentVersion = await prisma.agentVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentVersionCreateManyArgs>(args?: SelectSubset<T, AgentVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentVersions and returns the data saved in the database.
     * @param {AgentVersionCreateManyAndReturnArgs} args - Arguments to create many AgentVersions.
     * @example
     * // Create many AgentVersions
     * const agentVersion = await prisma.agentVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentVersions and only return the `id`
     * const agentVersionWithIdOnly = await prisma.agentVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentVersion.
     * @param {AgentVersionDeleteArgs} args - Arguments to delete one AgentVersion.
     * @example
     * // Delete one AgentVersion
     * const AgentVersion = await prisma.agentVersion.delete({
     *   where: {
     *     // ... filter to delete one AgentVersion
     *   }
     * })
     * 
     */
    delete<T extends AgentVersionDeleteArgs>(args: SelectSubset<T, AgentVersionDeleteArgs<ExtArgs>>): Prisma__AgentVersionClient<$Result.GetResult<Prisma.$AgentVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentVersion.
     * @param {AgentVersionUpdateArgs} args - Arguments to update one AgentVersion.
     * @example
     * // Update one AgentVersion
     * const agentVersion = await prisma.agentVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentVersionUpdateArgs>(args: SelectSubset<T, AgentVersionUpdateArgs<ExtArgs>>): Prisma__AgentVersionClient<$Result.GetResult<Prisma.$AgentVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentVersions.
     * @param {AgentVersionDeleteManyArgs} args - Arguments to filter AgentVersions to delete.
     * @example
     * // Delete a few AgentVersions
     * const { count } = await prisma.agentVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentVersionDeleteManyArgs>(args?: SelectSubset<T, AgentVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentVersions
     * const agentVersion = await prisma.agentVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentVersionUpdateManyArgs>(args: SelectSubset<T, AgentVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentVersions and returns the data updated in the database.
     * @param {AgentVersionUpdateManyAndReturnArgs} args - Arguments to update many AgentVersions.
     * @example
     * // Update many AgentVersions
     * const agentVersion = await prisma.agentVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentVersions and only return the `id`
     * const agentVersionWithIdOnly = await prisma.agentVersion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentVersionUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentVersion.
     * @param {AgentVersionUpsertArgs} args - Arguments to update or create a AgentVersion.
     * @example
     * // Update or create a AgentVersion
     * const agentVersion = await prisma.agentVersion.upsert({
     *   create: {
     *     // ... data to create a AgentVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentVersion we want to update
     *   }
     * })
     */
    upsert<T extends AgentVersionUpsertArgs>(args: SelectSubset<T, AgentVersionUpsertArgs<ExtArgs>>): Prisma__AgentVersionClient<$Result.GetResult<Prisma.$AgentVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentVersionCountArgs} args - Arguments to filter AgentVersions to count.
     * @example
     * // Count the number of AgentVersions
     * const count = await prisma.agentVersion.count({
     *   where: {
     *     // ... the filter for the AgentVersions we want to count
     *   }
     * })
    **/
    count<T extends AgentVersionCountArgs>(
      args?: Subset<T, AgentVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentVersionAggregateArgs>(args: Subset<T, AgentVersionAggregateArgs>): Prisma.PrismaPromise<GetAgentVersionAggregateType<T>>

    /**
     * Group by AgentVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentVersionGroupByArgs['orderBy'] }
        : { orderBy?: AgentVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentVersion model
   */
  readonly fields: AgentVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agentDefinition<T extends AgentDefinitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgentDefinitionDefaultArgs<ExtArgs>>): Prisma__AgentDefinitionClient<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentVersion model
   */
  interface AgentVersionFieldRefs {
    readonly id: FieldRef<"AgentVersion", 'String'>
    readonly agentDefinitionId: FieldRef<"AgentVersion", 'String'>
    readonly version: FieldRef<"AgentVersion", 'Int'>
    readonly instructions: FieldRef<"AgentVersion", 'String'>
    readonly allowedTools: FieldRef<"AgentVersion", 'Json'>
    readonly defaultModel: FieldRef<"AgentVersion", 'String'>
    readonly outputSchema: FieldRef<"AgentVersion", 'Json'>
    readonly flowDefinition: FieldRef<"AgentVersion", 'Json'>
    readonly changelog: FieldRef<"AgentVersion", 'String'>
    readonly createdAt: FieldRef<"AgentVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentVersion findUnique
   */
  export type AgentVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionInclude<ExtArgs> | null
    /**
     * Filter, which AgentVersion to fetch.
     */
    where: AgentVersionWhereUniqueInput
  }

  /**
   * AgentVersion findUniqueOrThrow
   */
  export type AgentVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionInclude<ExtArgs> | null
    /**
     * Filter, which AgentVersion to fetch.
     */
    where: AgentVersionWhereUniqueInput
  }

  /**
   * AgentVersion findFirst
   */
  export type AgentVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionInclude<ExtArgs> | null
    /**
     * Filter, which AgentVersion to fetch.
     */
    where?: AgentVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentVersions to fetch.
     */
    orderBy?: AgentVersionOrderByWithRelationInput | AgentVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentVersions.
     */
    cursor?: AgentVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentVersions.
     */
    distinct?: AgentVersionScalarFieldEnum | AgentVersionScalarFieldEnum[]
  }

  /**
   * AgentVersion findFirstOrThrow
   */
  export type AgentVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionInclude<ExtArgs> | null
    /**
     * Filter, which AgentVersion to fetch.
     */
    where?: AgentVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentVersions to fetch.
     */
    orderBy?: AgentVersionOrderByWithRelationInput | AgentVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentVersions.
     */
    cursor?: AgentVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentVersions.
     */
    distinct?: AgentVersionScalarFieldEnum | AgentVersionScalarFieldEnum[]
  }

  /**
   * AgentVersion findMany
   */
  export type AgentVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionInclude<ExtArgs> | null
    /**
     * Filter, which AgentVersions to fetch.
     */
    where?: AgentVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentVersions to fetch.
     */
    orderBy?: AgentVersionOrderByWithRelationInput | AgentVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentVersions.
     */
    cursor?: AgentVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentVersions.
     */
    distinct?: AgentVersionScalarFieldEnum | AgentVersionScalarFieldEnum[]
  }

  /**
   * AgentVersion create
   */
  export type AgentVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a AgentVersion.
     */
    data: XOR<AgentVersionCreateInput, AgentVersionUncheckedCreateInput>
  }

  /**
   * AgentVersion createMany
   */
  export type AgentVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentVersions.
     */
    data: AgentVersionCreateManyInput | AgentVersionCreateManyInput[]
  }

  /**
   * AgentVersion createManyAndReturn
   */
  export type AgentVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * The data used to create many AgentVersions.
     */
    data: AgentVersionCreateManyInput | AgentVersionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentVersion update
   */
  export type AgentVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a AgentVersion.
     */
    data: XOR<AgentVersionUpdateInput, AgentVersionUncheckedUpdateInput>
    /**
     * Choose, which AgentVersion to update.
     */
    where: AgentVersionWhereUniqueInput
  }

  /**
   * AgentVersion updateMany
   */
  export type AgentVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentVersions.
     */
    data: XOR<AgentVersionUpdateManyMutationInput, AgentVersionUncheckedUpdateManyInput>
    /**
     * Filter which AgentVersions to update
     */
    where?: AgentVersionWhereInput
    /**
     * Limit how many AgentVersions to update.
     */
    limit?: number
  }

  /**
   * AgentVersion updateManyAndReturn
   */
  export type AgentVersionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * The data used to update AgentVersions.
     */
    data: XOR<AgentVersionUpdateManyMutationInput, AgentVersionUncheckedUpdateManyInput>
    /**
     * Filter which AgentVersions to update
     */
    where?: AgentVersionWhereInput
    /**
     * Limit how many AgentVersions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentVersion upsert
   */
  export type AgentVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the AgentVersion to update in case it exists.
     */
    where: AgentVersionWhereUniqueInput
    /**
     * In case the AgentVersion found by the `where` argument doesn't exist, create a new AgentVersion with this data.
     */
    create: XOR<AgentVersionCreateInput, AgentVersionUncheckedCreateInput>
    /**
     * In case the AgentVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentVersionUpdateInput, AgentVersionUncheckedUpdateInput>
  }

  /**
   * AgentVersion delete
   */
  export type AgentVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionInclude<ExtArgs> | null
    /**
     * Filter which AgentVersion to delete.
     */
    where: AgentVersionWhereUniqueInput
  }

  /**
   * AgentVersion deleteMany
   */
  export type AgentVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentVersions to delete
     */
    where?: AgentVersionWhereInput
    /**
     * Limit how many AgentVersions to delete.
     */
    limit?: number
  }

  /**
   * AgentVersion without action
   */
  export type AgentVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentVersion
     */
    select?: AgentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentVersion
     */
    omit?: AgentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentVersionInclude<ExtArgs> | null
  }


  /**
   * Model AgentRun
   */

  export type AggregateAgentRun = {
    _count: AgentRunCountAggregateOutputType | null
    _avg: AgentRunAvgAggregateOutputType | null
    _sum: AgentRunSumAggregateOutputType | null
    _min: AgentRunMinAggregateOutputType | null
    _max: AgentRunMaxAggregateOutputType | null
  }

  export type AgentRunAvgAggregateOutputType = {
    costEstimate: number | null
    durationMs: number | null
  }

  export type AgentRunSumAggregateOutputType = {
    costEstimate: number | null
    durationMs: number | null
  }

  export type AgentRunMinAggregateOutputType = {
    id: string | null
    agentDefinitionId: string | null
    agentVersionId: string | null
    sessionId: string | null
    status: string | null
    input: string | null
    finalOutput: string | null
    costEstimate: number | null
    durationMs: number | null
    error: string | null
    triggeredBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgentRunMaxAggregateOutputType = {
    id: string | null
    agentDefinitionId: string | null
    agentVersionId: string | null
    sessionId: string | null
    status: string | null
    input: string | null
    finalOutput: string | null
    costEstimate: number | null
    durationMs: number | null
    error: string | null
    triggeredBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgentRunCountAggregateOutputType = {
    id: number
    agentDefinitionId: number
    agentVersionId: number
    sessionId: number
    status: number
    input: number
    finalOutput: number
    tokenUsage: number
    costEstimate: number
    durationMs: number
    error: number
    triggeredBy: number
    meta: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AgentRunAvgAggregateInputType = {
    costEstimate?: true
    durationMs?: true
  }

  export type AgentRunSumAggregateInputType = {
    costEstimate?: true
    durationMs?: true
  }

  export type AgentRunMinAggregateInputType = {
    id?: true
    agentDefinitionId?: true
    agentVersionId?: true
    sessionId?: true
    status?: true
    input?: true
    finalOutput?: true
    costEstimate?: true
    durationMs?: true
    error?: true
    triggeredBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgentRunMaxAggregateInputType = {
    id?: true
    agentDefinitionId?: true
    agentVersionId?: true
    sessionId?: true
    status?: true
    input?: true
    finalOutput?: true
    costEstimate?: true
    durationMs?: true
    error?: true
    triggeredBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgentRunCountAggregateInputType = {
    id?: true
    agentDefinitionId?: true
    agentVersionId?: true
    sessionId?: true
    status?: true
    input?: true
    finalOutput?: true
    tokenUsage?: true
    costEstimate?: true
    durationMs?: true
    error?: true
    triggeredBy?: true
    meta?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AgentRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentRun to aggregate.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentRuns
    **/
    _count?: true | AgentRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AgentRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AgentRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentRunMaxAggregateInputType
  }

  export type GetAgentRunAggregateType<T extends AgentRunAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentRun[P]>
      : GetScalarType<T[P], AggregateAgentRun[P]>
  }




  export type AgentRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentRunWhereInput
    orderBy?: AgentRunOrderByWithAggregationInput | AgentRunOrderByWithAggregationInput[]
    by: AgentRunScalarFieldEnum[] | AgentRunScalarFieldEnum
    having?: AgentRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentRunCountAggregateInputType | true
    _avg?: AgentRunAvgAggregateInputType
    _sum?: AgentRunSumAggregateInputType
    _min?: AgentRunMinAggregateInputType
    _max?: AgentRunMaxAggregateInputType
  }

  export type AgentRunGroupByOutputType = {
    id: string
    agentDefinitionId: string
    agentVersionId: string | null
    sessionId: string | null
    status: string
    input: string
    finalOutput: string | null
    tokenUsage: JsonValue | null
    costEstimate: number | null
    durationMs: number | null
    error: string | null
    triggeredBy: string
    meta: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: AgentRunCountAggregateOutputType | null
    _avg: AgentRunAvgAggregateOutputType | null
    _sum: AgentRunSumAggregateOutputType | null
    _min: AgentRunMinAggregateOutputType | null
    _max: AgentRunMaxAggregateOutputType | null
  }

  type GetAgentRunGroupByPayload<T extends AgentRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentRunGroupByOutputType[P]>
            : GetScalarType<T[P], AgentRunGroupByOutputType[P]>
        }
      >
    >


  export type AgentRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentDefinitionId?: boolean
    agentVersionId?: boolean
    sessionId?: boolean
    status?: boolean
    input?: boolean
    finalOutput?: boolean
    tokenUsage?: boolean
    costEstimate?: boolean
    durationMs?: boolean
    error?: boolean
    triggeredBy?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
    session?: boolean | AgentRun$sessionArgs<ExtArgs>
    steps?: boolean | AgentRun$stepsArgs<ExtArgs>
    artifacts?: boolean | AgentRun$artifactsArgs<ExtArgs>
    evals?: boolean | AgentRun$evalsArgs<ExtArgs>
    _count?: boolean | AgentRunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentRun"]>

  export type AgentRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentDefinitionId?: boolean
    agentVersionId?: boolean
    sessionId?: boolean
    status?: boolean
    input?: boolean
    finalOutput?: boolean
    tokenUsage?: boolean
    costEstimate?: boolean
    durationMs?: boolean
    error?: boolean
    triggeredBy?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
    session?: boolean | AgentRun$sessionArgs<ExtArgs>
  }, ExtArgs["result"]["agentRun"]>

  export type AgentRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentDefinitionId?: boolean
    agentVersionId?: boolean
    sessionId?: boolean
    status?: boolean
    input?: boolean
    finalOutput?: boolean
    tokenUsage?: boolean
    costEstimate?: boolean
    durationMs?: boolean
    error?: boolean
    triggeredBy?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
    session?: boolean | AgentRun$sessionArgs<ExtArgs>
  }, ExtArgs["result"]["agentRun"]>

  export type AgentRunSelectScalar = {
    id?: boolean
    agentDefinitionId?: boolean
    agentVersionId?: boolean
    sessionId?: boolean
    status?: boolean
    input?: boolean
    finalOutput?: boolean
    tokenUsage?: boolean
    costEstimate?: boolean
    durationMs?: boolean
    error?: boolean
    triggeredBy?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AgentRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "agentDefinitionId" | "agentVersionId" | "sessionId" | "status" | "input" | "finalOutput" | "tokenUsage" | "costEstimate" | "durationMs" | "error" | "triggeredBy" | "meta" | "createdAt" | "updatedAt", ExtArgs["result"]["agentRun"]>
  export type AgentRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
    session?: boolean | AgentRun$sessionArgs<ExtArgs>
    steps?: boolean | AgentRun$stepsArgs<ExtArgs>
    artifacts?: boolean | AgentRun$artifactsArgs<ExtArgs>
    evals?: boolean | AgentRun$evalsArgs<ExtArgs>
    _count?: boolean | AgentRunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AgentRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
    session?: boolean | AgentRun$sessionArgs<ExtArgs>
  }
  export type AgentRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
    session?: boolean | AgentRun$sessionArgs<ExtArgs>
  }

  export type $AgentRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentRun"
    objects: {
      agentDefinition: Prisma.$AgentDefinitionPayload<ExtArgs>
      session: Prisma.$ConversationSessionPayload<ExtArgs> | null
      steps: Prisma.$RunStepPayload<ExtArgs>[]
      artifacts: Prisma.$RunArtifactPayload<ExtArgs>[]
      evals: Prisma.$RunEvalPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agentDefinitionId: string
      agentVersionId: string | null
      sessionId: string | null
      status: string
      input: string
      finalOutput: string | null
      tokenUsage: Prisma.JsonValue | null
      costEstimate: number | null
      durationMs: number | null
      error: string | null
      triggeredBy: string
      meta: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["agentRun"]>
    composites: {}
  }

  type AgentRunGetPayload<S extends boolean | null | undefined | AgentRunDefaultArgs> = $Result.GetResult<Prisma.$AgentRunPayload, S>

  type AgentRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentRunCountAggregateInputType | true
    }

  export interface AgentRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentRun'], meta: { name: 'AgentRun' } }
    /**
     * Find zero or one AgentRun that matches the filter.
     * @param {AgentRunFindUniqueArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentRunFindUniqueArgs>(args: SelectSubset<T, AgentRunFindUniqueArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentRunFindUniqueOrThrowArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentRunFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunFindFirstArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentRunFindFirstArgs>(args?: SelectSubset<T, AgentRunFindFirstArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunFindFirstOrThrowArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentRunFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentRuns
     * const agentRuns = await prisma.agentRun.findMany()
     * 
     * // Get first 10 AgentRuns
     * const agentRuns = await prisma.agentRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentRunWithIdOnly = await prisma.agentRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentRunFindManyArgs>(args?: SelectSubset<T, AgentRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentRun.
     * @param {AgentRunCreateArgs} args - Arguments to create a AgentRun.
     * @example
     * // Create one AgentRun
     * const AgentRun = await prisma.agentRun.create({
     *   data: {
     *     // ... data to create a AgentRun
     *   }
     * })
     * 
     */
    create<T extends AgentRunCreateArgs>(args: SelectSubset<T, AgentRunCreateArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentRuns.
     * @param {AgentRunCreateManyArgs} args - Arguments to create many AgentRuns.
     * @example
     * // Create many AgentRuns
     * const agentRun = await prisma.agentRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentRunCreateManyArgs>(args?: SelectSubset<T, AgentRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentRuns and returns the data saved in the database.
     * @param {AgentRunCreateManyAndReturnArgs} args - Arguments to create many AgentRuns.
     * @example
     * // Create many AgentRuns
     * const agentRun = await prisma.agentRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentRuns and only return the `id`
     * const agentRunWithIdOnly = await prisma.agentRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentRunCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentRun.
     * @param {AgentRunDeleteArgs} args - Arguments to delete one AgentRun.
     * @example
     * // Delete one AgentRun
     * const AgentRun = await prisma.agentRun.delete({
     *   where: {
     *     // ... filter to delete one AgentRun
     *   }
     * })
     * 
     */
    delete<T extends AgentRunDeleteArgs>(args: SelectSubset<T, AgentRunDeleteArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentRun.
     * @param {AgentRunUpdateArgs} args - Arguments to update one AgentRun.
     * @example
     * // Update one AgentRun
     * const agentRun = await prisma.agentRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentRunUpdateArgs>(args: SelectSubset<T, AgentRunUpdateArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentRuns.
     * @param {AgentRunDeleteManyArgs} args - Arguments to filter AgentRuns to delete.
     * @example
     * // Delete a few AgentRuns
     * const { count } = await prisma.agentRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentRunDeleteManyArgs>(args?: SelectSubset<T, AgentRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentRuns
     * const agentRun = await prisma.agentRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentRunUpdateManyArgs>(args: SelectSubset<T, AgentRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentRuns and returns the data updated in the database.
     * @param {AgentRunUpdateManyAndReturnArgs} args - Arguments to update many AgentRuns.
     * @example
     * // Update many AgentRuns
     * const agentRun = await prisma.agentRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentRuns and only return the `id`
     * const agentRunWithIdOnly = await prisma.agentRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentRunUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentRun.
     * @param {AgentRunUpsertArgs} args - Arguments to update or create a AgentRun.
     * @example
     * // Update or create a AgentRun
     * const agentRun = await prisma.agentRun.upsert({
     *   create: {
     *     // ... data to create a AgentRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentRun we want to update
     *   }
     * })
     */
    upsert<T extends AgentRunUpsertArgs>(args: SelectSubset<T, AgentRunUpsertArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunCountArgs} args - Arguments to filter AgentRuns to count.
     * @example
     * // Count the number of AgentRuns
     * const count = await prisma.agentRun.count({
     *   where: {
     *     // ... the filter for the AgentRuns we want to count
     *   }
     * })
    **/
    count<T extends AgentRunCountArgs>(
      args?: Subset<T, AgentRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentRunAggregateArgs>(args: Subset<T, AgentRunAggregateArgs>): Prisma.PrismaPromise<GetAgentRunAggregateType<T>>

    /**
     * Group by AgentRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentRunGroupByArgs['orderBy'] }
        : { orderBy?: AgentRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentRun model
   */
  readonly fields: AgentRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agentDefinition<T extends AgentDefinitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgentDefinitionDefaultArgs<ExtArgs>>): Prisma__AgentDefinitionClient<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    session<T extends AgentRun$sessionArgs<ExtArgs> = {}>(args?: Subset<T, AgentRun$sessionArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    steps<T extends AgentRun$stepsArgs<ExtArgs> = {}>(args?: Subset<T, AgentRun$stepsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    artifacts<T extends AgentRun$artifactsArgs<ExtArgs> = {}>(args?: Subset<T, AgentRun$artifactsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunArtifactPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    evals<T extends AgentRun$evalsArgs<ExtArgs> = {}>(args?: Subset<T, AgentRun$evalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunEvalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentRun model
   */
  interface AgentRunFieldRefs {
    readonly id: FieldRef<"AgentRun", 'String'>
    readonly agentDefinitionId: FieldRef<"AgentRun", 'String'>
    readonly agentVersionId: FieldRef<"AgentRun", 'String'>
    readonly sessionId: FieldRef<"AgentRun", 'String'>
    readonly status: FieldRef<"AgentRun", 'String'>
    readonly input: FieldRef<"AgentRun", 'String'>
    readonly finalOutput: FieldRef<"AgentRun", 'String'>
    readonly tokenUsage: FieldRef<"AgentRun", 'Json'>
    readonly costEstimate: FieldRef<"AgentRun", 'Float'>
    readonly durationMs: FieldRef<"AgentRun", 'Int'>
    readonly error: FieldRef<"AgentRun", 'String'>
    readonly triggeredBy: FieldRef<"AgentRun", 'String'>
    readonly meta: FieldRef<"AgentRun", 'Json'>
    readonly createdAt: FieldRef<"AgentRun", 'DateTime'>
    readonly updatedAt: FieldRef<"AgentRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentRun findUnique
   */
  export type AgentRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun findUniqueOrThrow
   */
  export type AgentRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun findFirst
   */
  export type AgentRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentRuns.
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentRuns.
     */
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentRun findFirstOrThrow
   */
  export type AgentRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentRuns.
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentRuns.
     */
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentRun findMany
   */
  export type AgentRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRuns to fetch.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentRuns.
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentRuns.
     */
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentRun create
   */
  export type AgentRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * The data needed to create a AgentRun.
     */
    data: XOR<AgentRunCreateInput, AgentRunUncheckedCreateInput>
  }

  /**
   * AgentRun createMany
   */
  export type AgentRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentRuns.
     */
    data: AgentRunCreateManyInput | AgentRunCreateManyInput[]
  }

  /**
   * AgentRun createManyAndReturn
   */
  export type AgentRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * The data used to create many AgentRuns.
     */
    data: AgentRunCreateManyInput | AgentRunCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentRun update
   */
  export type AgentRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * The data needed to update a AgentRun.
     */
    data: XOR<AgentRunUpdateInput, AgentRunUncheckedUpdateInput>
    /**
     * Choose, which AgentRun to update.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun updateMany
   */
  export type AgentRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentRuns.
     */
    data: XOR<AgentRunUpdateManyMutationInput, AgentRunUncheckedUpdateManyInput>
    /**
     * Filter which AgentRuns to update
     */
    where?: AgentRunWhereInput
    /**
     * Limit how many AgentRuns to update.
     */
    limit?: number
  }

  /**
   * AgentRun updateManyAndReturn
   */
  export type AgentRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * The data used to update AgentRuns.
     */
    data: XOR<AgentRunUpdateManyMutationInput, AgentRunUncheckedUpdateManyInput>
    /**
     * Filter which AgentRuns to update
     */
    where?: AgentRunWhereInput
    /**
     * Limit how many AgentRuns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentRun upsert
   */
  export type AgentRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * The filter to search for the AgentRun to update in case it exists.
     */
    where: AgentRunWhereUniqueInput
    /**
     * In case the AgentRun found by the `where` argument doesn't exist, create a new AgentRun with this data.
     */
    create: XOR<AgentRunCreateInput, AgentRunUncheckedCreateInput>
    /**
     * In case the AgentRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentRunUpdateInput, AgentRunUncheckedUpdateInput>
  }

  /**
   * AgentRun delete
   */
  export type AgentRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter which AgentRun to delete.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun deleteMany
   */
  export type AgentRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentRuns to delete
     */
    where?: AgentRunWhereInput
    /**
     * Limit how many AgentRuns to delete.
     */
    limit?: number
  }

  /**
   * AgentRun.session
   */
  export type AgentRun$sessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    where?: ConversationSessionWhereInput
  }

  /**
   * AgentRun.steps
   */
  export type AgentRun$stepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepInclude<ExtArgs> | null
    where?: RunStepWhereInput
    orderBy?: RunStepOrderByWithRelationInput | RunStepOrderByWithRelationInput[]
    cursor?: RunStepWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RunStepScalarFieldEnum | RunStepScalarFieldEnum[]
  }

  /**
   * AgentRun.artifacts
   */
  export type AgentRun$artifactsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactInclude<ExtArgs> | null
    where?: RunArtifactWhereInput
    orderBy?: RunArtifactOrderByWithRelationInput | RunArtifactOrderByWithRelationInput[]
    cursor?: RunArtifactWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RunArtifactScalarFieldEnum | RunArtifactScalarFieldEnum[]
  }

  /**
   * AgentRun.evals
   */
  export type AgentRun$evalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalInclude<ExtArgs> | null
    where?: RunEvalWhereInput
    orderBy?: RunEvalOrderByWithRelationInput | RunEvalOrderByWithRelationInput[]
    cursor?: RunEvalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RunEvalScalarFieldEnum | RunEvalScalarFieldEnum[]
  }

  /**
   * AgentRun without action
   */
  export type AgentRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
  }


  /**
   * Model ConversationSession
   */

  export type AggregateConversationSession = {
    _count: ConversationSessionCountAggregateOutputType | null
    _min: ConversationSessionMinAggregateOutputType | null
    _max: ConversationSessionMaxAggregateOutputType | null
  }

  export type ConversationSessionMinAggregateOutputType = {
    id: string | null
    agentDefinitionId: string | null
    status: string | null
    participantId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConversationSessionMaxAggregateOutputType = {
    id: string | null
    agentDefinitionId: string | null
    status: string | null
    participantId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConversationSessionCountAggregateOutputType = {
    id: number
    agentDefinitionId: number
    status: number
    participantId: number
    meta: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConversationSessionMinAggregateInputType = {
    id?: true
    agentDefinitionId?: true
    status?: true
    participantId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConversationSessionMaxAggregateInputType = {
    id?: true
    agentDefinitionId?: true
    status?: true
    participantId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConversationSessionCountAggregateInputType = {
    id?: true
    agentDefinitionId?: true
    status?: true
    participantId?: true
    meta?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConversationSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConversationSession to aggregate.
     */
    where?: ConversationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationSessions to fetch.
     */
    orderBy?: ConversationSessionOrderByWithRelationInput | ConversationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConversationSessions
    **/
    _count?: true | ConversationSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversationSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversationSessionMaxAggregateInputType
  }

  export type GetConversationSessionAggregateType<T extends ConversationSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateConversationSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversationSession[P]>
      : GetScalarType<T[P], AggregateConversationSession[P]>
  }




  export type ConversationSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationSessionWhereInput
    orderBy?: ConversationSessionOrderByWithAggregationInput | ConversationSessionOrderByWithAggregationInput[]
    by: ConversationSessionScalarFieldEnum[] | ConversationSessionScalarFieldEnum
    having?: ConversationSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversationSessionCountAggregateInputType | true
    _min?: ConversationSessionMinAggregateInputType
    _max?: ConversationSessionMaxAggregateInputType
  }

  export type ConversationSessionGroupByOutputType = {
    id: string
    agentDefinitionId: string
    status: string
    participantId: string | null
    meta: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: ConversationSessionCountAggregateOutputType | null
    _min: ConversationSessionMinAggregateOutputType | null
    _max: ConversationSessionMaxAggregateOutputType | null
  }

  type GetConversationSessionGroupByPayload<T extends ConversationSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversationSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversationSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversationSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ConversationSessionGroupByOutputType[P]>
        }
      >
    >


  export type ConversationSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentDefinitionId?: boolean
    status?: boolean
    participantId?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
    runs?: boolean | ConversationSession$runsArgs<ExtArgs>
    _count?: boolean | ConversationSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversationSession"]>

  export type ConversationSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentDefinitionId?: boolean
    status?: boolean
    participantId?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversationSession"]>

  export type ConversationSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentDefinitionId?: boolean
    status?: boolean
    participantId?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversationSession"]>

  export type ConversationSessionSelectScalar = {
    id?: boolean
    agentDefinitionId?: boolean
    status?: boolean
    participantId?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConversationSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "agentDefinitionId" | "status" | "participantId" | "meta" | "createdAt" | "updatedAt", ExtArgs["result"]["conversationSession"]>
  export type ConversationSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
    runs?: boolean | ConversationSession$runsArgs<ExtArgs>
    _count?: boolean | ConversationSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConversationSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
  }
  export type ConversationSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agentDefinition?: boolean | AgentDefinitionDefaultArgs<ExtArgs>
  }

  export type $ConversationSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConversationSession"
    objects: {
      agentDefinition: Prisma.$AgentDefinitionPayload<ExtArgs>
      runs: Prisma.$AgentRunPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agentDefinitionId: string
      status: string
      participantId: string | null
      meta: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["conversationSession"]>
    composites: {}
  }

  type ConversationSessionGetPayload<S extends boolean | null | undefined | ConversationSessionDefaultArgs> = $Result.GetResult<Prisma.$ConversationSessionPayload, S>

  type ConversationSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConversationSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConversationSessionCountAggregateInputType | true
    }

  export interface ConversationSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConversationSession'], meta: { name: 'ConversationSession' } }
    /**
     * Find zero or one ConversationSession that matches the filter.
     * @param {ConversationSessionFindUniqueArgs} args - Arguments to find a ConversationSession
     * @example
     * // Get one ConversationSession
     * const conversationSession = await prisma.conversationSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversationSessionFindUniqueArgs>(args: SelectSubset<T, ConversationSessionFindUniqueArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConversationSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConversationSessionFindUniqueOrThrowArgs} args - Arguments to find a ConversationSession
     * @example
     * // Get one ConversationSession
     * const conversationSession = await prisma.conversationSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversationSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversationSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConversationSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionFindFirstArgs} args - Arguments to find a ConversationSession
     * @example
     * // Get one ConversationSession
     * const conversationSession = await prisma.conversationSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversationSessionFindFirstArgs>(args?: SelectSubset<T, ConversationSessionFindFirstArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConversationSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionFindFirstOrThrowArgs} args - Arguments to find a ConversationSession
     * @example
     * // Get one ConversationSession
     * const conversationSession = await prisma.conversationSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversationSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversationSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConversationSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConversationSessions
     * const conversationSessions = await prisma.conversationSession.findMany()
     * 
     * // Get first 10 ConversationSessions
     * const conversationSessions = await prisma.conversationSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversationSessionWithIdOnly = await prisma.conversationSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversationSessionFindManyArgs>(args?: SelectSubset<T, ConversationSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConversationSession.
     * @param {ConversationSessionCreateArgs} args - Arguments to create a ConversationSession.
     * @example
     * // Create one ConversationSession
     * const ConversationSession = await prisma.conversationSession.create({
     *   data: {
     *     // ... data to create a ConversationSession
     *   }
     * })
     * 
     */
    create<T extends ConversationSessionCreateArgs>(args: SelectSubset<T, ConversationSessionCreateArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConversationSessions.
     * @param {ConversationSessionCreateManyArgs} args - Arguments to create many ConversationSessions.
     * @example
     * // Create many ConversationSessions
     * const conversationSession = await prisma.conversationSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversationSessionCreateManyArgs>(args?: SelectSubset<T, ConversationSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConversationSessions and returns the data saved in the database.
     * @param {ConversationSessionCreateManyAndReturnArgs} args - Arguments to create many ConversationSessions.
     * @example
     * // Create many ConversationSessions
     * const conversationSession = await prisma.conversationSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConversationSessions and only return the `id`
     * const conversationSessionWithIdOnly = await prisma.conversationSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConversationSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, ConversationSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConversationSession.
     * @param {ConversationSessionDeleteArgs} args - Arguments to delete one ConversationSession.
     * @example
     * // Delete one ConversationSession
     * const ConversationSession = await prisma.conversationSession.delete({
     *   where: {
     *     // ... filter to delete one ConversationSession
     *   }
     * })
     * 
     */
    delete<T extends ConversationSessionDeleteArgs>(args: SelectSubset<T, ConversationSessionDeleteArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConversationSession.
     * @param {ConversationSessionUpdateArgs} args - Arguments to update one ConversationSession.
     * @example
     * // Update one ConversationSession
     * const conversationSession = await prisma.conversationSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversationSessionUpdateArgs>(args: SelectSubset<T, ConversationSessionUpdateArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConversationSessions.
     * @param {ConversationSessionDeleteManyArgs} args - Arguments to filter ConversationSessions to delete.
     * @example
     * // Delete a few ConversationSessions
     * const { count } = await prisma.conversationSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversationSessionDeleteManyArgs>(args?: SelectSubset<T, ConversationSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConversationSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConversationSessions
     * const conversationSession = await prisma.conversationSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversationSessionUpdateManyArgs>(args: SelectSubset<T, ConversationSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConversationSessions and returns the data updated in the database.
     * @param {ConversationSessionUpdateManyAndReturnArgs} args - Arguments to update many ConversationSessions.
     * @example
     * // Update many ConversationSessions
     * const conversationSession = await prisma.conversationSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConversationSessions and only return the `id`
     * const conversationSessionWithIdOnly = await prisma.conversationSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConversationSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, ConversationSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConversationSession.
     * @param {ConversationSessionUpsertArgs} args - Arguments to update or create a ConversationSession.
     * @example
     * // Update or create a ConversationSession
     * const conversationSession = await prisma.conversationSession.upsert({
     *   create: {
     *     // ... data to create a ConversationSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConversationSession we want to update
     *   }
     * })
     */
    upsert<T extends ConversationSessionUpsertArgs>(args: SelectSubset<T, ConversationSessionUpsertArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConversationSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionCountArgs} args - Arguments to filter ConversationSessions to count.
     * @example
     * // Count the number of ConversationSessions
     * const count = await prisma.conversationSession.count({
     *   where: {
     *     // ... the filter for the ConversationSessions we want to count
     *   }
     * })
    **/
    count<T extends ConversationSessionCountArgs>(
      args?: Subset<T, ConversationSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversationSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConversationSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConversationSessionAggregateArgs>(args: Subset<T, ConversationSessionAggregateArgs>): Prisma.PrismaPromise<GetConversationSessionAggregateType<T>>

    /**
     * Group by ConversationSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConversationSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversationSessionGroupByArgs['orderBy'] }
        : { orderBy?: ConversationSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConversationSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConversationSession model
   */
  readonly fields: ConversationSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConversationSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversationSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agentDefinition<T extends AgentDefinitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgentDefinitionDefaultArgs<ExtArgs>>): Prisma__AgentDefinitionClient<$Result.GetResult<Prisma.$AgentDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    runs<T extends ConversationSession$runsArgs<ExtArgs> = {}>(args?: Subset<T, ConversationSession$runsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConversationSession model
   */
  interface ConversationSessionFieldRefs {
    readonly id: FieldRef<"ConversationSession", 'String'>
    readonly agentDefinitionId: FieldRef<"ConversationSession", 'String'>
    readonly status: FieldRef<"ConversationSession", 'String'>
    readonly participantId: FieldRef<"ConversationSession", 'String'>
    readonly meta: FieldRef<"ConversationSession", 'Json'>
    readonly createdAt: FieldRef<"ConversationSession", 'DateTime'>
    readonly updatedAt: FieldRef<"ConversationSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConversationSession findUnique
   */
  export type ConversationSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * Filter, which ConversationSession to fetch.
     */
    where: ConversationSessionWhereUniqueInput
  }

  /**
   * ConversationSession findUniqueOrThrow
   */
  export type ConversationSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * Filter, which ConversationSession to fetch.
     */
    where: ConversationSessionWhereUniqueInput
  }

  /**
   * ConversationSession findFirst
   */
  export type ConversationSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * Filter, which ConversationSession to fetch.
     */
    where?: ConversationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationSessions to fetch.
     */
    orderBy?: ConversationSessionOrderByWithRelationInput | ConversationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConversationSessions.
     */
    cursor?: ConversationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversationSessions.
     */
    distinct?: ConversationSessionScalarFieldEnum | ConversationSessionScalarFieldEnum[]
  }

  /**
   * ConversationSession findFirstOrThrow
   */
  export type ConversationSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * Filter, which ConversationSession to fetch.
     */
    where?: ConversationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationSessions to fetch.
     */
    orderBy?: ConversationSessionOrderByWithRelationInput | ConversationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConversationSessions.
     */
    cursor?: ConversationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversationSessions.
     */
    distinct?: ConversationSessionScalarFieldEnum | ConversationSessionScalarFieldEnum[]
  }

  /**
   * ConversationSession findMany
   */
  export type ConversationSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * Filter, which ConversationSessions to fetch.
     */
    where?: ConversationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationSessions to fetch.
     */
    orderBy?: ConversationSessionOrderByWithRelationInput | ConversationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConversationSessions.
     */
    cursor?: ConversationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversationSessions.
     */
    distinct?: ConversationSessionScalarFieldEnum | ConversationSessionScalarFieldEnum[]
  }

  /**
   * ConversationSession create
   */
  export type ConversationSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a ConversationSession.
     */
    data: XOR<ConversationSessionCreateInput, ConversationSessionUncheckedCreateInput>
  }

  /**
   * ConversationSession createMany
   */
  export type ConversationSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConversationSessions.
     */
    data: ConversationSessionCreateManyInput | ConversationSessionCreateManyInput[]
  }

  /**
   * ConversationSession createManyAndReturn
   */
  export type ConversationSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * The data used to create many ConversationSessions.
     */
    data: ConversationSessionCreateManyInput | ConversationSessionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConversationSession update
   */
  export type ConversationSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a ConversationSession.
     */
    data: XOR<ConversationSessionUpdateInput, ConversationSessionUncheckedUpdateInput>
    /**
     * Choose, which ConversationSession to update.
     */
    where: ConversationSessionWhereUniqueInput
  }

  /**
   * ConversationSession updateMany
   */
  export type ConversationSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConversationSessions.
     */
    data: XOR<ConversationSessionUpdateManyMutationInput, ConversationSessionUncheckedUpdateManyInput>
    /**
     * Filter which ConversationSessions to update
     */
    where?: ConversationSessionWhereInput
    /**
     * Limit how many ConversationSessions to update.
     */
    limit?: number
  }

  /**
   * ConversationSession updateManyAndReturn
   */
  export type ConversationSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * The data used to update ConversationSessions.
     */
    data: XOR<ConversationSessionUpdateManyMutationInput, ConversationSessionUncheckedUpdateManyInput>
    /**
     * Filter which ConversationSessions to update
     */
    where?: ConversationSessionWhereInput
    /**
     * Limit how many ConversationSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConversationSession upsert
   */
  export type ConversationSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the ConversationSession to update in case it exists.
     */
    where: ConversationSessionWhereUniqueInput
    /**
     * In case the ConversationSession found by the `where` argument doesn't exist, create a new ConversationSession with this data.
     */
    create: XOR<ConversationSessionCreateInput, ConversationSessionUncheckedCreateInput>
    /**
     * In case the ConversationSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversationSessionUpdateInput, ConversationSessionUncheckedUpdateInput>
  }

  /**
   * ConversationSession delete
   */
  export type ConversationSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * Filter which ConversationSession to delete.
     */
    where: ConversationSessionWhereUniqueInput
  }

  /**
   * ConversationSession deleteMany
   */
  export type ConversationSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConversationSessions to delete
     */
    where?: ConversationSessionWhereInput
    /**
     * Limit how many ConversationSessions to delete.
     */
    limit?: number
  }

  /**
   * ConversationSession.runs
   */
  export type ConversationSession$runsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    where?: AgentRunWhereInput
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    cursor?: AgentRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * ConversationSession without action
   */
  export type ConversationSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
  }


  /**
   * Model RunStep
   */

  export type AggregateRunStep = {
    _count: RunStepCountAggregateOutputType | null
    _avg: RunStepAvgAggregateOutputType | null
    _sum: RunStepSumAggregateOutputType | null
    _min: RunStepMinAggregateOutputType | null
    _max: RunStepMaxAggregateOutputType | null
  }

  export type RunStepAvgAggregateOutputType = {
    stepIndex: number | null
    durationMs: number | null
  }

  export type RunStepSumAggregateOutputType = {
    stepIndex: number | null
    durationMs: number | null
  }

  export type RunStepMinAggregateOutputType = {
    id: string | null
    runId: string | null
    stepIndex: number | null
    kind: string | null
    status: string | null
    toolName: string | null
    nodeId: string | null
    durationMs: number | null
    error: string | null
    validationPassed: boolean | null
    createdAt: Date | null
  }

  export type RunStepMaxAggregateOutputType = {
    id: string | null
    runId: string | null
    stepIndex: number | null
    kind: string | null
    status: string | null
    toolName: string | null
    nodeId: string | null
    durationMs: number | null
    error: string | null
    validationPassed: boolean | null
    createdAt: Date | null
  }

  export type RunStepCountAggregateOutputType = {
    id: number
    runId: number
    stepIndex: number
    kind: number
    status: number
    toolName: number
    nodeId: number
    input: number
    output: number
    tokenUsage: number
    durationMs: number
    error: number
    validationPassed: number
    createdAt: number
    _all: number
  }


  export type RunStepAvgAggregateInputType = {
    stepIndex?: true
    durationMs?: true
  }

  export type RunStepSumAggregateInputType = {
    stepIndex?: true
    durationMs?: true
  }

  export type RunStepMinAggregateInputType = {
    id?: true
    runId?: true
    stepIndex?: true
    kind?: true
    status?: true
    toolName?: true
    nodeId?: true
    durationMs?: true
    error?: true
    validationPassed?: true
    createdAt?: true
  }

  export type RunStepMaxAggregateInputType = {
    id?: true
    runId?: true
    stepIndex?: true
    kind?: true
    status?: true
    toolName?: true
    nodeId?: true
    durationMs?: true
    error?: true
    validationPassed?: true
    createdAt?: true
  }

  export type RunStepCountAggregateInputType = {
    id?: true
    runId?: true
    stepIndex?: true
    kind?: true
    status?: true
    toolName?: true
    nodeId?: true
    input?: true
    output?: true
    tokenUsage?: true
    durationMs?: true
    error?: true
    validationPassed?: true
    createdAt?: true
    _all?: true
  }

  export type RunStepAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RunStep to aggregate.
     */
    where?: RunStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunSteps to fetch.
     */
    orderBy?: RunStepOrderByWithRelationInput | RunStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RunStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RunSteps
    **/
    _count?: true | RunStepCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RunStepAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RunStepSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RunStepMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RunStepMaxAggregateInputType
  }

  export type GetRunStepAggregateType<T extends RunStepAggregateArgs> = {
        [P in keyof T & keyof AggregateRunStep]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRunStep[P]>
      : GetScalarType<T[P], AggregateRunStep[P]>
  }




  export type RunStepGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RunStepWhereInput
    orderBy?: RunStepOrderByWithAggregationInput | RunStepOrderByWithAggregationInput[]
    by: RunStepScalarFieldEnum[] | RunStepScalarFieldEnum
    having?: RunStepScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RunStepCountAggregateInputType | true
    _avg?: RunStepAvgAggregateInputType
    _sum?: RunStepSumAggregateInputType
    _min?: RunStepMinAggregateInputType
    _max?: RunStepMaxAggregateInputType
  }

  export type RunStepGroupByOutputType = {
    id: string
    runId: string
    stepIndex: number
    kind: string
    status: string
    toolName: string | null
    nodeId: string | null
    input: JsonValue
    output: JsonValue | null
    tokenUsage: JsonValue | null
    durationMs: number | null
    error: string | null
    validationPassed: boolean | null
    createdAt: Date
    _count: RunStepCountAggregateOutputType | null
    _avg: RunStepAvgAggregateOutputType | null
    _sum: RunStepSumAggregateOutputType | null
    _min: RunStepMinAggregateOutputType | null
    _max: RunStepMaxAggregateOutputType | null
  }

  type GetRunStepGroupByPayload<T extends RunStepGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RunStepGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RunStepGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RunStepGroupByOutputType[P]>
            : GetScalarType<T[P], RunStepGroupByOutputType[P]>
        }
      >
    >


  export type RunStepSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    stepIndex?: boolean
    kind?: boolean
    status?: boolean
    toolName?: boolean
    nodeId?: boolean
    input?: boolean
    output?: boolean
    tokenUsage?: boolean
    durationMs?: boolean
    error?: boolean
    validationPassed?: boolean
    createdAt?: boolean
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["runStep"]>

  export type RunStepSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    stepIndex?: boolean
    kind?: boolean
    status?: boolean
    toolName?: boolean
    nodeId?: boolean
    input?: boolean
    output?: boolean
    tokenUsage?: boolean
    durationMs?: boolean
    error?: boolean
    validationPassed?: boolean
    createdAt?: boolean
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["runStep"]>

  export type RunStepSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    stepIndex?: boolean
    kind?: boolean
    status?: boolean
    toolName?: boolean
    nodeId?: boolean
    input?: boolean
    output?: boolean
    tokenUsage?: boolean
    durationMs?: boolean
    error?: boolean
    validationPassed?: boolean
    createdAt?: boolean
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["runStep"]>

  export type RunStepSelectScalar = {
    id?: boolean
    runId?: boolean
    stepIndex?: boolean
    kind?: boolean
    status?: boolean
    toolName?: boolean
    nodeId?: boolean
    input?: boolean
    output?: boolean
    tokenUsage?: boolean
    durationMs?: boolean
    error?: boolean
    validationPassed?: boolean
    createdAt?: boolean
  }

  export type RunStepOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "runId" | "stepIndex" | "kind" | "status" | "toolName" | "nodeId" | "input" | "output" | "tokenUsage" | "durationMs" | "error" | "validationPassed" | "createdAt", ExtArgs["result"]["runStep"]>
  export type RunStepInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }
  export type RunStepIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }
  export type RunStepIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }

  export type $RunStepPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RunStep"
    objects: {
      run: Prisma.$AgentRunPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      runId: string
      stepIndex: number
      kind: string
      status: string
      toolName: string | null
      nodeId: string | null
      input: Prisma.JsonValue
      output: Prisma.JsonValue | null
      tokenUsage: Prisma.JsonValue | null
      durationMs: number | null
      error: string | null
      validationPassed: boolean | null
      createdAt: Date
    }, ExtArgs["result"]["runStep"]>
    composites: {}
  }

  type RunStepGetPayload<S extends boolean | null | undefined | RunStepDefaultArgs> = $Result.GetResult<Prisma.$RunStepPayload, S>

  type RunStepCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RunStepFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RunStepCountAggregateInputType | true
    }

  export interface RunStepDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RunStep'], meta: { name: 'RunStep' } }
    /**
     * Find zero or one RunStep that matches the filter.
     * @param {RunStepFindUniqueArgs} args - Arguments to find a RunStep
     * @example
     * // Get one RunStep
     * const runStep = await prisma.runStep.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RunStepFindUniqueArgs>(args: SelectSubset<T, RunStepFindUniqueArgs<ExtArgs>>): Prisma__RunStepClient<$Result.GetResult<Prisma.$RunStepPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RunStep that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RunStepFindUniqueOrThrowArgs} args - Arguments to find a RunStep
     * @example
     * // Get one RunStep
     * const runStep = await prisma.runStep.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RunStepFindUniqueOrThrowArgs>(args: SelectSubset<T, RunStepFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RunStepClient<$Result.GetResult<Prisma.$RunStepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RunStep that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunStepFindFirstArgs} args - Arguments to find a RunStep
     * @example
     * // Get one RunStep
     * const runStep = await prisma.runStep.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RunStepFindFirstArgs>(args?: SelectSubset<T, RunStepFindFirstArgs<ExtArgs>>): Prisma__RunStepClient<$Result.GetResult<Prisma.$RunStepPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RunStep that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunStepFindFirstOrThrowArgs} args - Arguments to find a RunStep
     * @example
     * // Get one RunStep
     * const runStep = await prisma.runStep.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RunStepFindFirstOrThrowArgs>(args?: SelectSubset<T, RunStepFindFirstOrThrowArgs<ExtArgs>>): Prisma__RunStepClient<$Result.GetResult<Prisma.$RunStepPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RunSteps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunStepFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RunSteps
     * const runSteps = await prisma.runStep.findMany()
     * 
     * // Get first 10 RunSteps
     * const runSteps = await prisma.runStep.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const runStepWithIdOnly = await prisma.runStep.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RunStepFindManyArgs>(args?: SelectSubset<T, RunStepFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RunStep.
     * @param {RunStepCreateArgs} args - Arguments to create a RunStep.
     * @example
     * // Create one RunStep
     * const RunStep = await prisma.runStep.create({
     *   data: {
     *     // ... data to create a RunStep
     *   }
     * })
     * 
     */
    create<T extends RunStepCreateArgs>(args: SelectSubset<T, RunStepCreateArgs<ExtArgs>>): Prisma__RunStepClient<$Result.GetResult<Prisma.$RunStepPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RunSteps.
     * @param {RunStepCreateManyArgs} args - Arguments to create many RunSteps.
     * @example
     * // Create many RunSteps
     * const runStep = await prisma.runStep.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RunStepCreateManyArgs>(args?: SelectSubset<T, RunStepCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RunSteps and returns the data saved in the database.
     * @param {RunStepCreateManyAndReturnArgs} args - Arguments to create many RunSteps.
     * @example
     * // Create many RunSteps
     * const runStep = await prisma.runStep.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RunSteps and only return the `id`
     * const runStepWithIdOnly = await prisma.runStep.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RunStepCreateManyAndReturnArgs>(args?: SelectSubset<T, RunStepCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunStepPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RunStep.
     * @param {RunStepDeleteArgs} args - Arguments to delete one RunStep.
     * @example
     * // Delete one RunStep
     * const RunStep = await prisma.runStep.delete({
     *   where: {
     *     // ... filter to delete one RunStep
     *   }
     * })
     * 
     */
    delete<T extends RunStepDeleteArgs>(args: SelectSubset<T, RunStepDeleteArgs<ExtArgs>>): Prisma__RunStepClient<$Result.GetResult<Prisma.$RunStepPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RunStep.
     * @param {RunStepUpdateArgs} args - Arguments to update one RunStep.
     * @example
     * // Update one RunStep
     * const runStep = await prisma.runStep.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RunStepUpdateArgs>(args: SelectSubset<T, RunStepUpdateArgs<ExtArgs>>): Prisma__RunStepClient<$Result.GetResult<Prisma.$RunStepPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RunSteps.
     * @param {RunStepDeleteManyArgs} args - Arguments to filter RunSteps to delete.
     * @example
     * // Delete a few RunSteps
     * const { count } = await prisma.runStep.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RunStepDeleteManyArgs>(args?: SelectSubset<T, RunStepDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RunSteps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunStepUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RunSteps
     * const runStep = await prisma.runStep.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RunStepUpdateManyArgs>(args: SelectSubset<T, RunStepUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RunSteps and returns the data updated in the database.
     * @param {RunStepUpdateManyAndReturnArgs} args - Arguments to update many RunSteps.
     * @example
     * // Update many RunSteps
     * const runStep = await prisma.runStep.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RunSteps and only return the `id`
     * const runStepWithIdOnly = await prisma.runStep.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RunStepUpdateManyAndReturnArgs>(args: SelectSubset<T, RunStepUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunStepPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RunStep.
     * @param {RunStepUpsertArgs} args - Arguments to update or create a RunStep.
     * @example
     * // Update or create a RunStep
     * const runStep = await prisma.runStep.upsert({
     *   create: {
     *     // ... data to create a RunStep
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RunStep we want to update
     *   }
     * })
     */
    upsert<T extends RunStepUpsertArgs>(args: SelectSubset<T, RunStepUpsertArgs<ExtArgs>>): Prisma__RunStepClient<$Result.GetResult<Prisma.$RunStepPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RunSteps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunStepCountArgs} args - Arguments to filter RunSteps to count.
     * @example
     * // Count the number of RunSteps
     * const count = await prisma.runStep.count({
     *   where: {
     *     // ... the filter for the RunSteps we want to count
     *   }
     * })
    **/
    count<T extends RunStepCountArgs>(
      args?: Subset<T, RunStepCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RunStepCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RunStep.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunStepAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RunStepAggregateArgs>(args: Subset<T, RunStepAggregateArgs>): Prisma.PrismaPromise<GetRunStepAggregateType<T>>

    /**
     * Group by RunStep.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunStepGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RunStepGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RunStepGroupByArgs['orderBy'] }
        : { orderBy?: RunStepGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RunStepGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRunStepGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RunStep model
   */
  readonly fields: RunStepFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RunStep.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RunStepClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    run<T extends AgentRunDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgentRunDefaultArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RunStep model
   */
  interface RunStepFieldRefs {
    readonly id: FieldRef<"RunStep", 'String'>
    readonly runId: FieldRef<"RunStep", 'String'>
    readonly stepIndex: FieldRef<"RunStep", 'Int'>
    readonly kind: FieldRef<"RunStep", 'String'>
    readonly status: FieldRef<"RunStep", 'String'>
    readonly toolName: FieldRef<"RunStep", 'String'>
    readonly nodeId: FieldRef<"RunStep", 'String'>
    readonly input: FieldRef<"RunStep", 'Json'>
    readonly output: FieldRef<"RunStep", 'Json'>
    readonly tokenUsage: FieldRef<"RunStep", 'Json'>
    readonly durationMs: FieldRef<"RunStep", 'Int'>
    readonly error: FieldRef<"RunStep", 'String'>
    readonly validationPassed: FieldRef<"RunStep", 'Boolean'>
    readonly createdAt: FieldRef<"RunStep", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RunStep findUnique
   */
  export type RunStepFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepInclude<ExtArgs> | null
    /**
     * Filter, which RunStep to fetch.
     */
    where: RunStepWhereUniqueInput
  }

  /**
   * RunStep findUniqueOrThrow
   */
  export type RunStepFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepInclude<ExtArgs> | null
    /**
     * Filter, which RunStep to fetch.
     */
    where: RunStepWhereUniqueInput
  }

  /**
   * RunStep findFirst
   */
  export type RunStepFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepInclude<ExtArgs> | null
    /**
     * Filter, which RunStep to fetch.
     */
    where?: RunStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunSteps to fetch.
     */
    orderBy?: RunStepOrderByWithRelationInput | RunStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RunSteps.
     */
    cursor?: RunStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RunSteps.
     */
    distinct?: RunStepScalarFieldEnum | RunStepScalarFieldEnum[]
  }

  /**
   * RunStep findFirstOrThrow
   */
  export type RunStepFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepInclude<ExtArgs> | null
    /**
     * Filter, which RunStep to fetch.
     */
    where?: RunStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunSteps to fetch.
     */
    orderBy?: RunStepOrderByWithRelationInput | RunStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RunSteps.
     */
    cursor?: RunStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RunSteps.
     */
    distinct?: RunStepScalarFieldEnum | RunStepScalarFieldEnum[]
  }

  /**
   * RunStep findMany
   */
  export type RunStepFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepInclude<ExtArgs> | null
    /**
     * Filter, which RunSteps to fetch.
     */
    where?: RunStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunSteps to fetch.
     */
    orderBy?: RunStepOrderByWithRelationInput | RunStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RunSteps.
     */
    cursor?: RunStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RunSteps.
     */
    distinct?: RunStepScalarFieldEnum | RunStepScalarFieldEnum[]
  }

  /**
   * RunStep create
   */
  export type RunStepCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepInclude<ExtArgs> | null
    /**
     * The data needed to create a RunStep.
     */
    data: XOR<RunStepCreateInput, RunStepUncheckedCreateInput>
  }

  /**
   * RunStep createMany
   */
  export type RunStepCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RunSteps.
     */
    data: RunStepCreateManyInput | RunStepCreateManyInput[]
  }

  /**
   * RunStep createManyAndReturn
   */
  export type RunStepCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * The data used to create many RunSteps.
     */
    data: RunStepCreateManyInput | RunStepCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RunStep update
   */
  export type RunStepUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepInclude<ExtArgs> | null
    /**
     * The data needed to update a RunStep.
     */
    data: XOR<RunStepUpdateInput, RunStepUncheckedUpdateInput>
    /**
     * Choose, which RunStep to update.
     */
    where: RunStepWhereUniqueInput
  }

  /**
   * RunStep updateMany
   */
  export type RunStepUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RunSteps.
     */
    data: XOR<RunStepUpdateManyMutationInput, RunStepUncheckedUpdateManyInput>
    /**
     * Filter which RunSteps to update
     */
    where?: RunStepWhereInput
    /**
     * Limit how many RunSteps to update.
     */
    limit?: number
  }

  /**
   * RunStep updateManyAndReturn
   */
  export type RunStepUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * The data used to update RunSteps.
     */
    data: XOR<RunStepUpdateManyMutationInput, RunStepUncheckedUpdateManyInput>
    /**
     * Filter which RunSteps to update
     */
    where?: RunStepWhereInput
    /**
     * Limit how many RunSteps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RunStep upsert
   */
  export type RunStepUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepInclude<ExtArgs> | null
    /**
     * The filter to search for the RunStep to update in case it exists.
     */
    where: RunStepWhereUniqueInput
    /**
     * In case the RunStep found by the `where` argument doesn't exist, create a new RunStep with this data.
     */
    create: XOR<RunStepCreateInput, RunStepUncheckedCreateInput>
    /**
     * In case the RunStep was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RunStepUpdateInput, RunStepUncheckedUpdateInput>
  }

  /**
   * RunStep delete
   */
  export type RunStepDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepInclude<ExtArgs> | null
    /**
     * Filter which RunStep to delete.
     */
    where: RunStepWhereUniqueInput
  }

  /**
   * RunStep deleteMany
   */
  export type RunStepDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RunSteps to delete
     */
    where?: RunStepWhereInput
    /**
     * Limit how many RunSteps to delete.
     */
    limit?: number
  }

  /**
   * RunStep without action
   */
  export type RunStepDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunStep
     */
    select?: RunStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunStep
     */
    omit?: RunStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunStepInclude<ExtArgs> | null
  }


  /**
   * Model RunArtifact
   */

  export type AggregateRunArtifact = {
    _count: RunArtifactCountAggregateOutputType | null
    _min: RunArtifactMinAggregateOutputType | null
    _max: RunArtifactMaxAggregateOutputType | null
  }

  export type RunArtifactMinAggregateOutputType = {
    id: string | null
    runId: string | null
    kind: string | null
    targetType: string | null
    targetId: string | null
    appliedAt: Date | null
    appliedBy: string | null
    rejected: boolean | null
    rejectedReason: string | null
    rejectedAt: Date | null
    rejectedBy: string | null
    ignoredAt: Date | null
    createdAt: Date | null
  }

  export type RunArtifactMaxAggregateOutputType = {
    id: string | null
    runId: string | null
    kind: string | null
    targetType: string | null
    targetId: string | null
    appliedAt: Date | null
    appliedBy: string | null
    rejected: boolean | null
    rejectedReason: string | null
    rejectedAt: Date | null
    rejectedBy: string | null
    ignoredAt: Date | null
    createdAt: Date | null
  }

  export type RunArtifactCountAggregateOutputType = {
    id: number
    runId: number
    kind: number
    targetType: number
    targetId: number
    data: number
    previousData: number
    appliedAt: number
    appliedBy: number
    rejected: number
    rejectedReason: number
    rejectedAt: number
    rejectedBy: number
    proposalOutcome: number
    ignoredAt: number
    createdAt: number
    _all: number
  }


  export type RunArtifactMinAggregateInputType = {
    id?: true
    runId?: true
    kind?: true
    targetType?: true
    targetId?: true
    appliedAt?: true
    appliedBy?: true
    rejected?: true
    rejectedReason?: true
    rejectedAt?: true
    rejectedBy?: true
    ignoredAt?: true
    createdAt?: true
  }

  export type RunArtifactMaxAggregateInputType = {
    id?: true
    runId?: true
    kind?: true
    targetType?: true
    targetId?: true
    appliedAt?: true
    appliedBy?: true
    rejected?: true
    rejectedReason?: true
    rejectedAt?: true
    rejectedBy?: true
    ignoredAt?: true
    createdAt?: true
  }

  export type RunArtifactCountAggregateInputType = {
    id?: true
    runId?: true
    kind?: true
    targetType?: true
    targetId?: true
    data?: true
    previousData?: true
    appliedAt?: true
    appliedBy?: true
    rejected?: true
    rejectedReason?: true
    rejectedAt?: true
    rejectedBy?: true
    proposalOutcome?: true
    ignoredAt?: true
    createdAt?: true
    _all?: true
  }

  export type RunArtifactAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RunArtifact to aggregate.
     */
    where?: RunArtifactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunArtifacts to fetch.
     */
    orderBy?: RunArtifactOrderByWithRelationInput | RunArtifactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RunArtifactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunArtifacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunArtifacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RunArtifacts
    **/
    _count?: true | RunArtifactCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RunArtifactMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RunArtifactMaxAggregateInputType
  }

  export type GetRunArtifactAggregateType<T extends RunArtifactAggregateArgs> = {
        [P in keyof T & keyof AggregateRunArtifact]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRunArtifact[P]>
      : GetScalarType<T[P], AggregateRunArtifact[P]>
  }




  export type RunArtifactGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RunArtifactWhereInput
    orderBy?: RunArtifactOrderByWithAggregationInput | RunArtifactOrderByWithAggregationInput[]
    by: RunArtifactScalarFieldEnum[] | RunArtifactScalarFieldEnum
    having?: RunArtifactScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RunArtifactCountAggregateInputType | true
    _min?: RunArtifactMinAggregateInputType
    _max?: RunArtifactMaxAggregateInputType
  }

  export type RunArtifactGroupByOutputType = {
    id: string
    runId: string
    kind: string
    targetType: string | null
    targetId: string | null
    data: JsonValue
    previousData: JsonValue | null
    appliedAt: Date | null
    appliedBy: string | null
    rejected: boolean
    rejectedReason: string | null
    rejectedAt: Date | null
    rejectedBy: string | null
    proposalOutcome: JsonValue | null
    ignoredAt: Date | null
    createdAt: Date
    _count: RunArtifactCountAggregateOutputType | null
    _min: RunArtifactMinAggregateOutputType | null
    _max: RunArtifactMaxAggregateOutputType | null
  }

  type GetRunArtifactGroupByPayload<T extends RunArtifactGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RunArtifactGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RunArtifactGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RunArtifactGroupByOutputType[P]>
            : GetScalarType<T[P], RunArtifactGroupByOutputType[P]>
        }
      >
    >


  export type RunArtifactSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    kind?: boolean
    targetType?: boolean
    targetId?: boolean
    data?: boolean
    previousData?: boolean
    appliedAt?: boolean
    appliedBy?: boolean
    rejected?: boolean
    rejectedReason?: boolean
    rejectedAt?: boolean
    rejectedBy?: boolean
    proposalOutcome?: boolean
    ignoredAt?: boolean
    createdAt?: boolean
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["runArtifact"]>

  export type RunArtifactSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    kind?: boolean
    targetType?: boolean
    targetId?: boolean
    data?: boolean
    previousData?: boolean
    appliedAt?: boolean
    appliedBy?: boolean
    rejected?: boolean
    rejectedReason?: boolean
    rejectedAt?: boolean
    rejectedBy?: boolean
    proposalOutcome?: boolean
    ignoredAt?: boolean
    createdAt?: boolean
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["runArtifact"]>

  export type RunArtifactSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    kind?: boolean
    targetType?: boolean
    targetId?: boolean
    data?: boolean
    previousData?: boolean
    appliedAt?: boolean
    appliedBy?: boolean
    rejected?: boolean
    rejectedReason?: boolean
    rejectedAt?: boolean
    rejectedBy?: boolean
    proposalOutcome?: boolean
    ignoredAt?: boolean
    createdAt?: boolean
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["runArtifact"]>

  export type RunArtifactSelectScalar = {
    id?: boolean
    runId?: boolean
    kind?: boolean
    targetType?: boolean
    targetId?: boolean
    data?: boolean
    previousData?: boolean
    appliedAt?: boolean
    appliedBy?: boolean
    rejected?: boolean
    rejectedReason?: boolean
    rejectedAt?: boolean
    rejectedBy?: boolean
    proposalOutcome?: boolean
    ignoredAt?: boolean
    createdAt?: boolean
  }

  export type RunArtifactOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "runId" | "kind" | "targetType" | "targetId" | "data" | "previousData" | "appliedAt" | "appliedBy" | "rejected" | "rejectedReason" | "rejectedAt" | "rejectedBy" | "proposalOutcome" | "ignoredAt" | "createdAt", ExtArgs["result"]["runArtifact"]>
  export type RunArtifactInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }
  export type RunArtifactIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }
  export type RunArtifactIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }

  export type $RunArtifactPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RunArtifact"
    objects: {
      run: Prisma.$AgentRunPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      runId: string
      kind: string
      targetType: string | null
      targetId: string | null
      data: Prisma.JsonValue
      previousData: Prisma.JsonValue | null
      appliedAt: Date | null
      appliedBy: string | null
      rejected: boolean
      rejectedReason: string | null
      rejectedAt: Date | null
      rejectedBy: string | null
      proposalOutcome: Prisma.JsonValue | null
      ignoredAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["runArtifact"]>
    composites: {}
  }

  type RunArtifactGetPayload<S extends boolean | null | undefined | RunArtifactDefaultArgs> = $Result.GetResult<Prisma.$RunArtifactPayload, S>

  type RunArtifactCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RunArtifactFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RunArtifactCountAggregateInputType | true
    }

  export interface RunArtifactDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RunArtifact'], meta: { name: 'RunArtifact' } }
    /**
     * Find zero or one RunArtifact that matches the filter.
     * @param {RunArtifactFindUniqueArgs} args - Arguments to find a RunArtifact
     * @example
     * // Get one RunArtifact
     * const runArtifact = await prisma.runArtifact.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RunArtifactFindUniqueArgs>(args: SelectSubset<T, RunArtifactFindUniqueArgs<ExtArgs>>): Prisma__RunArtifactClient<$Result.GetResult<Prisma.$RunArtifactPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RunArtifact that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RunArtifactFindUniqueOrThrowArgs} args - Arguments to find a RunArtifact
     * @example
     * // Get one RunArtifact
     * const runArtifact = await prisma.runArtifact.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RunArtifactFindUniqueOrThrowArgs>(args: SelectSubset<T, RunArtifactFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RunArtifactClient<$Result.GetResult<Prisma.$RunArtifactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RunArtifact that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunArtifactFindFirstArgs} args - Arguments to find a RunArtifact
     * @example
     * // Get one RunArtifact
     * const runArtifact = await prisma.runArtifact.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RunArtifactFindFirstArgs>(args?: SelectSubset<T, RunArtifactFindFirstArgs<ExtArgs>>): Prisma__RunArtifactClient<$Result.GetResult<Prisma.$RunArtifactPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RunArtifact that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunArtifactFindFirstOrThrowArgs} args - Arguments to find a RunArtifact
     * @example
     * // Get one RunArtifact
     * const runArtifact = await prisma.runArtifact.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RunArtifactFindFirstOrThrowArgs>(args?: SelectSubset<T, RunArtifactFindFirstOrThrowArgs<ExtArgs>>): Prisma__RunArtifactClient<$Result.GetResult<Prisma.$RunArtifactPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RunArtifacts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunArtifactFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RunArtifacts
     * const runArtifacts = await prisma.runArtifact.findMany()
     * 
     * // Get first 10 RunArtifacts
     * const runArtifacts = await prisma.runArtifact.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const runArtifactWithIdOnly = await prisma.runArtifact.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RunArtifactFindManyArgs>(args?: SelectSubset<T, RunArtifactFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunArtifactPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RunArtifact.
     * @param {RunArtifactCreateArgs} args - Arguments to create a RunArtifact.
     * @example
     * // Create one RunArtifact
     * const RunArtifact = await prisma.runArtifact.create({
     *   data: {
     *     // ... data to create a RunArtifact
     *   }
     * })
     * 
     */
    create<T extends RunArtifactCreateArgs>(args: SelectSubset<T, RunArtifactCreateArgs<ExtArgs>>): Prisma__RunArtifactClient<$Result.GetResult<Prisma.$RunArtifactPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RunArtifacts.
     * @param {RunArtifactCreateManyArgs} args - Arguments to create many RunArtifacts.
     * @example
     * // Create many RunArtifacts
     * const runArtifact = await prisma.runArtifact.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RunArtifactCreateManyArgs>(args?: SelectSubset<T, RunArtifactCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RunArtifacts and returns the data saved in the database.
     * @param {RunArtifactCreateManyAndReturnArgs} args - Arguments to create many RunArtifacts.
     * @example
     * // Create many RunArtifacts
     * const runArtifact = await prisma.runArtifact.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RunArtifacts and only return the `id`
     * const runArtifactWithIdOnly = await prisma.runArtifact.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RunArtifactCreateManyAndReturnArgs>(args?: SelectSubset<T, RunArtifactCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunArtifactPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RunArtifact.
     * @param {RunArtifactDeleteArgs} args - Arguments to delete one RunArtifact.
     * @example
     * // Delete one RunArtifact
     * const RunArtifact = await prisma.runArtifact.delete({
     *   where: {
     *     // ... filter to delete one RunArtifact
     *   }
     * })
     * 
     */
    delete<T extends RunArtifactDeleteArgs>(args: SelectSubset<T, RunArtifactDeleteArgs<ExtArgs>>): Prisma__RunArtifactClient<$Result.GetResult<Prisma.$RunArtifactPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RunArtifact.
     * @param {RunArtifactUpdateArgs} args - Arguments to update one RunArtifact.
     * @example
     * // Update one RunArtifact
     * const runArtifact = await prisma.runArtifact.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RunArtifactUpdateArgs>(args: SelectSubset<T, RunArtifactUpdateArgs<ExtArgs>>): Prisma__RunArtifactClient<$Result.GetResult<Prisma.$RunArtifactPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RunArtifacts.
     * @param {RunArtifactDeleteManyArgs} args - Arguments to filter RunArtifacts to delete.
     * @example
     * // Delete a few RunArtifacts
     * const { count } = await prisma.runArtifact.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RunArtifactDeleteManyArgs>(args?: SelectSubset<T, RunArtifactDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RunArtifacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunArtifactUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RunArtifacts
     * const runArtifact = await prisma.runArtifact.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RunArtifactUpdateManyArgs>(args: SelectSubset<T, RunArtifactUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RunArtifacts and returns the data updated in the database.
     * @param {RunArtifactUpdateManyAndReturnArgs} args - Arguments to update many RunArtifacts.
     * @example
     * // Update many RunArtifacts
     * const runArtifact = await prisma.runArtifact.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RunArtifacts and only return the `id`
     * const runArtifactWithIdOnly = await prisma.runArtifact.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RunArtifactUpdateManyAndReturnArgs>(args: SelectSubset<T, RunArtifactUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunArtifactPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RunArtifact.
     * @param {RunArtifactUpsertArgs} args - Arguments to update or create a RunArtifact.
     * @example
     * // Update or create a RunArtifact
     * const runArtifact = await prisma.runArtifact.upsert({
     *   create: {
     *     // ... data to create a RunArtifact
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RunArtifact we want to update
     *   }
     * })
     */
    upsert<T extends RunArtifactUpsertArgs>(args: SelectSubset<T, RunArtifactUpsertArgs<ExtArgs>>): Prisma__RunArtifactClient<$Result.GetResult<Prisma.$RunArtifactPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RunArtifacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunArtifactCountArgs} args - Arguments to filter RunArtifacts to count.
     * @example
     * // Count the number of RunArtifacts
     * const count = await prisma.runArtifact.count({
     *   where: {
     *     // ... the filter for the RunArtifacts we want to count
     *   }
     * })
    **/
    count<T extends RunArtifactCountArgs>(
      args?: Subset<T, RunArtifactCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RunArtifactCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RunArtifact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunArtifactAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RunArtifactAggregateArgs>(args: Subset<T, RunArtifactAggregateArgs>): Prisma.PrismaPromise<GetRunArtifactAggregateType<T>>

    /**
     * Group by RunArtifact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunArtifactGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RunArtifactGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RunArtifactGroupByArgs['orderBy'] }
        : { orderBy?: RunArtifactGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RunArtifactGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRunArtifactGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RunArtifact model
   */
  readonly fields: RunArtifactFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RunArtifact.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RunArtifactClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    run<T extends AgentRunDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgentRunDefaultArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RunArtifact model
   */
  interface RunArtifactFieldRefs {
    readonly id: FieldRef<"RunArtifact", 'String'>
    readonly runId: FieldRef<"RunArtifact", 'String'>
    readonly kind: FieldRef<"RunArtifact", 'String'>
    readonly targetType: FieldRef<"RunArtifact", 'String'>
    readonly targetId: FieldRef<"RunArtifact", 'String'>
    readonly data: FieldRef<"RunArtifact", 'Json'>
    readonly previousData: FieldRef<"RunArtifact", 'Json'>
    readonly appliedAt: FieldRef<"RunArtifact", 'DateTime'>
    readonly appliedBy: FieldRef<"RunArtifact", 'String'>
    readonly rejected: FieldRef<"RunArtifact", 'Boolean'>
    readonly rejectedReason: FieldRef<"RunArtifact", 'String'>
    readonly rejectedAt: FieldRef<"RunArtifact", 'DateTime'>
    readonly rejectedBy: FieldRef<"RunArtifact", 'String'>
    readonly proposalOutcome: FieldRef<"RunArtifact", 'Json'>
    readonly ignoredAt: FieldRef<"RunArtifact", 'DateTime'>
    readonly createdAt: FieldRef<"RunArtifact", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RunArtifact findUnique
   */
  export type RunArtifactFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactInclude<ExtArgs> | null
    /**
     * Filter, which RunArtifact to fetch.
     */
    where: RunArtifactWhereUniqueInput
  }

  /**
   * RunArtifact findUniqueOrThrow
   */
  export type RunArtifactFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactInclude<ExtArgs> | null
    /**
     * Filter, which RunArtifact to fetch.
     */
    where: RunArtifactWhereUniqueInput
  }

  /**
   * RunArtifact findFirst
   */
  export type RunArtifactFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactInclude<ExtArgs> | null
    /**
     * Filter, which RunArtifact to fetch.
     */
    where?: RunArtifactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunArtifacts to fetch.
     */
    orderBy?: RunArtifactOrderByWithRelationInput | RunArtifactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RunArtifacts.
     */
    cursor?: RunArtifactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunArtifacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunArtifacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RunArtifacts.
     */
    distinct?: RunArtifactScalarFieldEnum | RunArtifactScalarFieldEnum[]
  }

  /**
   * RunArtifact findFirstOrThrow
   */
  export type RunArtifactFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactInclude<ExtArgs> | null
    /**
     * Filter, which RunArtifact to fetch.
     */
    where?: RunArtifactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunArtifacts to fetch.
     */
    orderBy?: RunArtifactOrderByWithRelationInput | RunArtifactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RunArtifacts.
     */
    cursor?: RunArtifactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunArtifacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunArtifacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RunArtifacts.
     */
    distinct?: RunArtifactScalarFieldEnum | RunArtifactScalarFieldEnum[]
  }

  /**
   * RunArtifact findMany
   */
  export type RunArtifactFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactInclude<ExtArgs> | null
    /**
     * Filter, which RunArtifacts to fetch.
     */
    where?: RunArtifactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunArtifacts to fetch.
     */
    orderBy?: RunArtifactOrderByWithRelationInput | RunArtifactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RunArtifacts.
     */
    cursor?: RunArtifactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunArtifacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunArtifacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RunArtifacts.
     */
    distinct?: RunArtifactScalarFieldEnum | RunArtifactScalarFieldEnum[]
  }

  /**
   * RunArtifact create
   */
  export type RunArtifactCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactInclude<ExtArgs> | null
    /**
     * The data needed to create a RunArtifact.
     */
    data: XOR<RunArtifactCreateInput, RunArtifactUncheckedCreateInput>
  }

  /**
   * RunArtifact createMany
   */
  export type RunArtifactCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RunArtifacts.
     */
    data: RunArtifactCreateManyInput | RunArtifactCreateManyInput[]
  }

  /**
   * RunArtifact createManyAndReturn
   */
  export type RunArtifactCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * The data used to create many RunArtifacts.
     */
    data: RunArtifactCreateManyInput | RunArtifactCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RunArtifact update
   */
  export type RunArtifactUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactInclude<ExtArgs> | null
    /**
     * The data needed to update a RunArtifact.
     */
    data: XOR<RunArtifactUpdateInput, RunArtifactUncheckedUpdateInput>
    /**
     * Choose, which RunArtifact to update.
     */
    where: RunArtifactWhereUniqueInput
  }

  /**
   * RunArtifact updateMany
   */
  export type RunArtifactUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RunArtifacts.
     */
    data: XOR<RunArtifactUpdateManyMutationInput, RunArtifactUncheckedUpdateManyInput>
    /**
     * Filter which RunArtifacts to update
     */
    where?: RunArtifactWhereInput
    /**
     * Limit how many RunArtifacts to update.
     */
    limit?: number
  }

  /**
   * RunArtifact updateManyAndReturn
   */
  export type RunArtifactUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * The data used to update RunArtifacts.
     */
    data: XOR<RunArtifactUpdateManyMutationInput, RunArtifactUncheckedUpdateManyInput>
    /**
     * Filter which RunArtifacts to update
     */
    where?: RunArtifactWhereInput
    /**
     * Limit how many RunArtifacts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RunArtifact upsert
   */
  export type RunArtifactUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactInclude<ExtArgs> | null
    /**
     * The filter to search for the RunArtifact to update in case it exists.
     */
    where: RunArtifactWhereUniqueInput
    /**
     * In case the RunArtifact found by the `where` argument doesn't exist, create a new RunArtifact with this data.
     */
    create: XOR<RunArtifactCreateInput, RunArtifactUncheckedCreateInput>
    /**
     * In case the RunArtifact was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RunArtifactUpdateInput, RunArtifactUncheckedUpdateInput>
  }

  /**
   * RunArtifact delete
   */
  export type RunArtifactDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactInclude<ExtArgs> | null
    /**
     * Filter which RunArtifact to delete.
     */
    where: RunArtifactWhereUniqueInput
  }

  /**
   * RunArtifact deleteMany
   */
  export type RunArtifactDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RunArtifacts to delete
     */
    where?: RunArtifactWhereInput
    /**
     * Limit how many RunArtifacts to delete.
     */
    limit?: number
  }

  /**
   * RunArtifact without action
   */
  export type RunArtifactDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunArtifact
     */
    select?: RunArtifactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunArtifact
     */
    omit?: RunArtifactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunArtifactInclude<ExtArgs> | null
  }


  /**
   * Model PrimitiveDefinition
   */

  export type AggregatePrimitiveDefinition = {
    _count: PrimitiveDefinitionCountAggregateOutputType | null
    _min: PrimitiveDefinitionMinAggregateOutputType | null
    _max: PrimitiveDefinitionMaxAggregateOutputType | null
  }

  export type PrimitiveDefinitionMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    kind: string | null
    description: string | null
    instructions: string | null
    defaultModel: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PrimitiveDefinitionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    kind: string | null
    description: string | null
    instructions: string | null
    defaultModel: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PrimitiveDefinitionCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    kind: number
    description: number
    instructions: number
    config: number
    allowedTools: number
    defaultModel: number
    meta: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PrimitiveDefinitionMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    kind?: true
    description?: true
    instructions?: true
    defaultModel?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PrimitiveDefinitionMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    kind?: true
    description?: true
    instructions?: true
    defaultModel?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PrimitiveDefinitionCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    kind?: true
    description?: true
    instructions?: true
    config?: true
    allowedTools?: true
    defaultModel?: true
    meta?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PrimitiveDefinitionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PrimitiveDefinition to aggregate.
     */
    where?: PrimitiveDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrimitiveDefinitions to fetch.
     */
    orderBy?: PrimitiveDefinitionOrderByWithRelationInput | PrimitiveDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PrimitiveDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrimitiveDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrimitiveDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PrimitiveDefinitions
    **/
    _count?: true | PrimitiveDefinitionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PrimitiveDefinitionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PrimitiveDefinitionMaxAggregateInputType
  }

  export type GetPrimitiveDefinitionAggregateType<T extends PrimitiveDefinitionAggregateArgs> = {
        [P in keyof T & keyof AggregatePrimitiveDefinition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrimitiveDefinition[P]>
      : GetScalarType<T[P], AggregatePrimitiveDefinition[P]>
  }




  export type PrimitiveDefinitionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PrimitiveDefinitionWhereInput
    orderBy?: PrimitiveDefinitionOrderByWithAggregationInput | PrimitiveDefinitionOrderByWithAggregationInput[]
    by: PrimitiveDefinitionScalarFieldEnum[] | PrimitiveDefinitionScalarFieldEnum
    having?: PrimitiveDefinitionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PrimitiveDefinitionCountAggregateInputType | true
    _min?: PrimitiveDefinitionMinAggregateInputType
    _max?: PrimitiveDefinitionMaxAggregateInputType
  }

  export type PrimitiveDefinitionGroupByOutputType = {
    id: string
    name: string
    slug: string
    kind: string
    description: string
    instructions: string
    config: JsonValue
    allowedTools: JsonValue
    defaultModel: string
    meta: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: PrimitiveDefinitionCountAggregateOutputType | null
    _min: PrimitiveDefinitionMinAggregateOutputType | null
    _max: PrimitiveDefinitionMaxAggregateOutputType | null
  }

  type GetPrimitiveDefinitionGroupByPayload<T extends PrimitiveDefinitionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PrimitiveDefinitionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PrimitiveDefinitionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PrimitiveDefinitionGroupByOutputType[P]>
            : GetScalarType<T[P], PrimitiveDefinitionGroupByOutputType[P]>
        }
      >
    >


  export type PrimitiveDefinitionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    kind?: boolean
    description?: boolean
    instructions?: boolean
    config?: boolean
    allowedTools?: boolean
    defaultModel?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["primitiveDefinition"]>

  export type PrimitiveDefinitionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    kind?: boolean
    description?: boolean
    instructions?: boolean
    config?: boolean
    allowedTools?: boolean
    defaultModel?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["primitiveDefinition"]>

  export type PrimitiveDefinitionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    kind?: boolean
    description?: boolean
    instructions?: boolean
    config?: boolean
    allowedTools?: boolean
    defaultModel?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["primitiveDefinition"]>

  export type PrimitiveDefinitionSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    kind?: boolean
    description?: boolean
    instructions?: boolean
    config?: boolean
    allowedTools?: boolean
    defaultModel?: boolean
    meta?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PrimitiveDefinitionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "kind" | "description" | "instructions" | "config" | "allowedTools" | "defaultModel" | "meta" | "createdAt" | "updatedAt", ExtArgs["result"]["primitiveDefinition"]>

  export type $PrimitiveDefinitionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PrimitiveDefinition"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      kind: string
      description: string
      instructions: string
      config: Prisma.JsonValue
      allowedTools: Prisma.JsonValue
      defaultModel: string
      meta: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["primitiveDefinition"]>
    composites: {}
  }

  type PrimitiveDefinitionGetPayload<S extends boolean | null | undefined | PrimitiveDefinitionDefaultArgs> = $Result.GetResult<Prisma.$PrimitiveDefinitionPayload, S>

  type PrimitiveDefinitionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PrimitiveDefinitionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PrimitiveDefinitionCountAggregateInputType | true
    }

  export interface PrimitiveDefinitionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PrimitiveDefinition'], meta: { name: 'PrimitiveDefinition' } }
    /**
     * Find zero or one PrimitiveDefinition that matches the filter.
     * @param {PrimitiveDefinitionFindUniqueArgs} args - Arguments to find a PrimitiveDefinition
     * @example
     * // Get one PrimitiveDefinition
     * const primitiveDefinition = await prisma.primitiveDefinition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PrimitiveDefinitionFindUniqueArgs>(args: SelectSubset<T, PrimitiveDefinitionFindUniqueArgs<ExtArgs>>): Prisma__PrimitiveDefinitionClient<$Result.GetResult<Prisma.$PrimitiveDefinitionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PrimitiveDefinition that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PrimitiveDefinitionFindUniqueOrThrowArgs} args - Arguments to find a PrimitiveDefinition
     * @example
     * // Get one PrimitiveDefinition
     * const primitiveDefinition = await prisma.primitiveDefinition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PrimitiveDefinitionFindUniqueOrThrowArgs>(args: SelectSubset<T, PrimitiveDefinitionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PrimitiveDefinitionClient<$Result.GetResult<Prisma.$PrimitiveDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PrimitiveDefinition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrimitiveDefinitionFindFirstArgs} args - Arguments to find a PrimitiveDefinition
     * @example
     * // Get one PrimitiveDefinition
     * const primitiveDefinition = await prisma.primitiveDefinition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PrimitiveDefinitionFindFirstArgs>(args?: SelectSubset<T, PrimitiveDefinitionFindFirstArgs<ExtArgs>>): Prisma__PrimitiveDefinitionClient<$Result.GetResult<Prisma.$PrimitiveDefinitionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PrimitiveDefinition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrimitiveDefinitionFindFirstOrThrowArgs} args - Arguments to find a PrimitiveDefinition
     * @example
     * // Get one PrimitiveDefinition
     * const primitiveDefinition = await prisma.primitiveDefinition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PrimitiveDefinitionFindFirstOrThrowArgs>(args?: SelectSubset<T, PrimitiveDefinitionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PrimitiveDefinitionClient<$Result.GetResult<Prisma.$PrimitiveDefinitionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PrimitiveDefinitions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrimitiveDefinitionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PrimitiveDefinitions
     * const primitiveDefinitions = await prisma.primitiveDefinition.findMany()
     * 
     * // Get first 10 PrimitiveDefinitions
     * const primitiveDefinitions = await prisma.primitiveDefinition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const primitiveDefinitionWithIdOnly = await prisma.primitiveDefinition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PrimitiveDefinitionFindManyArgs>(args?: SelectSubset<T, PrimitiveDefinitionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrimitiveDefinitionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PrimitiveDefinition.
     * @param {PrimitiveDefinitionCreateArgs} args - Arguments to create a PrimitiveDefinition.
     * @example
     * // Create one PrimitiveDefinition
     * const PrimitiveDefinition = await prisma.primitiveDefinition.create({
     *   data: {
     *     // ... data to create a PrimitiveDefinition
     *   }
     * })
     * 
     */
    create<T extends PrimitiveDefinitionCreateArgs>(args: SelectSubset<T, PrimitiveDefinitionCreateArgs<ExtArgs>>): Prisma__PrimitiveDefinitionClient<$Result.GetResult<Prisma.$PrimitiveDefinitionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PrimitiveDefinitions.
     * @param {PrimitiveDefinitionCreateManyArgs} args - Arguments to create many PrimitiveDefinitions.
     * @example
     * // Create many PrimitiveDefinitions
     * const primitiveDefinition = await prisma.primitiveDefinition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PrimitiveDefinitionCreateManyArgs>(args?: SelectSubset<T, PrimitiveDefinitionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PrimitiveDefinitions and returns the data saved in the database.
     * @param {PrimitiveDefinitionCreateManyAndReturnArgs} args - Arguments to create many PrimitiveDefinitions.
     * @example
     * // Create many PrimitiveDefinitions
     * const primitiveDefinition = await prisma.primitiveDefinition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PrimitiveDefinitions and only return the `id`
     * const primitiveDefinitionWithIdOnly = await prisma.primitiveDefinition.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PrimitiveDefinitionCreateManyAndReturnArgs>(args?: SelectSubset<T, PrimitiveDefinitionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrimitiveDefinitionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PrimitiveDefinition.
     * @param {PrimitiveDefinitionDeleteArgs} args - Arguments to delete one PrimitiveDefinition.
     * @example
     * // Delete one PrimitiveDefinition
     * const PrimitiveDefinition = await prisma.primitiveDefinition.delete({
     *   where: {
     *     // ... filter to delete one PrimitiveDefinition
     *   }
     * })
     * 
     */
    delete<T extends PrimitiveDefinitionDeleteArgs>(args: SelectSubset<T, PrimitiveDefinitionDeleteArgs<ExtArgs>>): Prisma__PrimitiveDefinitionClient<$Result.GetResult<Prisma.$PrimitiveDefinitionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PrimitiveDefinition.
     * @param {PrimitiveDefinitionUpdateArgs} args - Arguments to update one PrimitiveDefinition.
     * @example
     * // Update one PrimitiveDefinition
     * const primitiveDefinition = await prisma.primitiveDefinition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PrimitiveDefinitionUpdateArgs>(args: SelectSubset<T, PrimitiveDefinitionUpdateArgs<ExtArgs>>): Prisma__PrimitiveDefinitionClient<$Result.GetResult<Prisma.$PrimitiveDefinitionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PrimitiveDefinitions.
     * @param {PrimitiveDefinitionDeleteManyArgs} args - Arguments to filter PrimitiveDefinitions to delete.
     * @example
     * // Delete a few PrimitiveDefinitions
     * const { count } = await prisma.primitiveDefinition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PrimitiveDefinitionDeleteManyArgs>(args?: SelectSubset<T, PrimitiveDefinitionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PrimitiveDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrimitiveDefinitionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PrimitiveDefinitions
     * const primitiveDefinition = await prisma.primitiveDefinition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PrimitiveDefinitionUpdateManyArgs>(args: SelectSubset<T, PrimitiveDefinitionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PrimitiveDefinitions and returns the data updated in the database.
     * @param {PrimitiveDefinitionUpdateManyAndReturnArgs} args - Arguments to update many PrimitiveDefinitions.
     * @example
     * // Update many PrimitiveDefinitions
     * const primitiveDefinition = await prisma.primitiveDefinition.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PrimitiveDefinitions and only return the `id`
     * const primitiveDefinitionWithIdOnly = await prisma.primitiveDefinition.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PrimitiveDefinitionUpdateManyAndReturnArgs>(args: SelectSubset<T, PrimitiveDefinitionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrimitiveDefinitionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PrimitiveDefinition.
     * @param {PrimitiveDefinitionUpsertArgs} args - Arguments to update or create a PrimitiveDefinition.
     * @example
     * // Update or create a PrimitiveDefinition
     * const primitiveDefinition = await prisma.primitiveDefinition.upsert({
     *   create: {
     *     // ... data to create a PrimitiveDefinition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PrimitiveDefinition we want to update
     *   }
     * })
     */
    upsert<T extends PrimitiveDefinitionUpsertArgs>(args: SelectSubset<T, PrimitiveDefinitionUpsertArgs<ExtArgs>>): Prisma__PrimitiveDefinitionClient<$Result.GetResult<Prisma.$PrimitiveDefinitionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PrimitiveDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrimitiveDefinitionCountArgs} args - Arguments to filter PrimitiveDefinitions to count.
     * @example
     * // Count the number of PrimitiveDefinitions
     * const count = await prisma.primitiveDefinition.count({
     *   where: {
     *     // ... the filter for the PrimitiveDefinitions we want to count
     *   }
     * })
    **/
    count<T extends PrimitiveDefinitionCountArgs>(
      args?: Subset<T, PrimitiveDefinitionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PrimitiveDefinitionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PrimitiveDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrimitiveDefinitionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PrimitiveDefinitionAggregateArgs>(args: Subset<T, PrimitiveDefinitionAggregateArgs>): Prisma.PrismaPromise<GetPrimitiveDefinitionAggregateType<T>>

    /**
     * Group by PrimitiveDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrimitiveDefinitionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PrimitiveDefinitionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PrimitiveDefinitionGroupByArgs['orderBy'] }
        : { orderBy?: PrimitiveDefinitionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PrimitiveDefinitionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrimitiveDefinitionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PrimitiveDefinition model
   */
  readonly fields: PrimitiveDefinitionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PrimitiveDefinition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PrimitiveDefinitionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PrimitiveDefinition model
   */
  interface PrimitiveDefinitionFieldRefs {
    readonly id: FieldRef<"PrimitiveDefinition", 'String'>
    readonly name: FieldRef<"PrimitiveDefinition", 'String'>
    readonly slug: FieldRef<"PrimitiveDefinition", 'String'>
    readonly kind: FieldRef<"PrimitiveDefinition", 'String'>
    readonly description: FieldRef<"PrimitiveDefinition", 'String'>
    readonly instructions: FieldRef<"PrimitiveDefinition", 'String'>
    readonly config: FieldRef<"PrimitiveDefinition", 'Json'>
    readonly allowedTools: FieldRef<"PrimitiveDefinition", 'Json'>
    readonly defaultModel: FieldRef<"PrimitiveDefinition", 'String'>
    readonly meta: FieldRef<"PrimitiveDefinition", 'Json'>
    readonly createdAt: FieldRef<"PrimitiveDefinition", 'DateTime'>
    readonly updatedAt: FieldRef<"PrimitiveDefinition", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PrimitiveDefinition findUnique
   */
  export type PrimitiveDefinitionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrimitiveDefinition
     */
    select?: PrimitiveDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrimitiveDefinition
     */
    omit?: PrimitiveDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which PrimitiveDefinition to fetch.
     */
    where: PrimitiveDefinitionWhereUniqueInput
  }

  /**
   * PrimitiveDefinition findUniqueOrThrow
   */
  export type PrimitiveDefinitionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrimitiveDefinition
     */
    select?: PrimitiveDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrimitiveDefinition
     */
    omit?: PrimitiveDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which PrimitiveDefinition to fetch.
     */
    where: PrimitiveDefinitionWhereUniqueInput
  }

  /**
   * PrimitiveDefinition findFirst
   */
  export type PrimitiveDefinitionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrimitiveDefinition
     */
    select?: PrimitiveDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrimitiveDefinition
     */
    omit?: PrimitiveDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which PrimitiveDefinition to fetch.
     */
    where?: PrimitiveDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrimitiveDefinitions to fetch.
     */
    orderBy?: PrimitiveDefinitionOrderByWithRelationInput | PrimitiveDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PrimitiveDefinitions.
     */
    cursor?: PrimitiveDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrimitiveDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrimitiveDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrimitiveDefinitions.
     */
    distinct?: PrimitiveDefinitionScalarFieldEnum | PrimitiveDefinitionScalarFieldEnum[]
  }

  /**
   * PrimitiveDefinition findFirstOrThrow
   */
  export type PrimitiveDefinitionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrimitiveDefinition
     */
    select?: PrimitiveDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrimitiveDefinition
     */
    omit?: PrimitiveDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which PrimitiveDefinition to fetch.
     */
    where?: PrimitiveDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrimitiveDefinitions to fetch.
     */
    orderBy?: PrimitiveDefinitionOrderByWithRelationInput | PrimitiveDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PrimitiveDefinitions.
     */
    cursor?: PrimitiveDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrimitiveDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrimitiveDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrimitiveDefinitions.
     */
    distinct?: PrimitiveDefinitionScalarFieldEnum | PrimitiveDefinitionScalarFieldEnum[]
  }

  /**
   * PrimitiveDefinition findMany
   */
  export type PrimitiveDefinitionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrimitiveDefinition
     */
    select?: PrimitiveDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrimitiveDefinition
     */
    omit?: PrimitiveDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which PrimitiveDefinitions to fetch.
     */
    where?: PrimitiveDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrimitiveDefinitions to fetch.
     */
    orderBy?: PrimitiveDefinitionOrderByWithRelationInput | PrimitiveDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PrimitiveDefinitions.
     */
    cursor?: PrimitiveDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrimitiveDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrimitiveDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrimitiveDefinitions.
     */
    distinct?: PrimitiveDefinitionScalarFieldEnum | PrimitiveDefinitionScalarFieldEnum[]
  }

  /**
   * PrimitiveDefinition create
   */
  export type PrimitiveDefinitionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrimitiveDefinition
     */
    select?: PrimitiveDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrimitiveDefinition
     */
    omit?: PrimitiveDefinitionOmit<ExtArgs> | null
    /**
     * The data needed to create a PrimitiveDefinition.
     */
    data: XOR<PrimitiveDefinitionCreateInput, PrimitiveDefinitionUncheckedCreateInput>
  }

  /**
   * PrimitiveDefinition createMany
   */
  export type PrimitiveDefinitionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PrimitiveDefinitions.
     */
    data: PrimitiveDefinitionCreateManyInput | PrimitiveDefinitionCreateManyInput[]
  }

  /**
   * PrimitiveDefinition createManyAndReturn
   */
  export type PrimitiveDefinitionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrimitiveDefinition
     */
    select?: PrimitiveDefinitionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PrimitiveDefinition
     */
    omit?: PrimitiveDefinitionOmit<ExtArgs> | null
    /**
     * The data used to create many PrimitiveDefinitions.
     */
    data: PrimitiveDefinitionCreateManyInput | PrimitiveDefinitionCreateManyInput[]
  }

  /**
   * PrimitiveDefinition update
   */
  export type PrimitiveDefinitionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrimitiveDefinition
     */
    select?: PrimitiveDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrimitiveDefinition
     */
    omit?: PrimitiveDefinitionOmit<ExtArgs> | null
    /**
     * The data needed to update a PrimitiveDefinition.
     */
    data: XOR<PrimitiveDefinitionUpdateInput, PrimitiveDefinitionUncheckedUpdateInput>
    /**
     * Choose, which PrimitiveDefinition to update.
     */
    where: PrimitiveDefinitionWhereUniqueInput
  }

  /**
   * PrimitiveDefinition updateMany
   */
  export type PrimitiveDefinitionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PrimitiveDefinitions.
     */
    data: XOR<PrimitiveDefinitionUpdateManyMutationInput, PrimitiveDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which PrimitiveDefinitions to update
     */
    where?: PrimitiveDefinitionWhereInput
    /**
     * Limit how many PrimitiveDefinitions to update.
     */
    limit?: number
  }

  /**
   * PrimitiveDefinition updateManyAndReturn
   */
  export type PrimitiveDefinitionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrimitiveDefinition
     */
    select?: PrimitiveDefinitionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PrimitiveDefinition
     */
    omit?: PrimitiveDefinitionOmit<ExtArgs> | null
    /**
     * The data used to update PrimitiveDefinitions.
     */
    data: XOR<PrimitiveDefinitionUpdateManyMutationInput, PrimitiveDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which PrimitiveDefinitions to update
     */
    where?: PrimitiveDefinitionWhereInput
    /**
     * Limit how many PrimitiveDefinitions to update.
     */
    limit?: number
  }

  /**
   * PrimitiveDefinition upsert
   */
  export type PrimitiveDefinitionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrimitiveDefinition
     */
    select?: PrimitiveDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrimitiveDefinition
     */
    omit?: PrimitiveDefinitionOmit<ExtArgs> | null
    /**
     * The filter to search for the PrimitiveDefinition to update in case it exists.
     */
    where: PrimitiveDefinitionWhereUniqueInput
    /**
     * In case the PrimitiveDefinition found by the `where` argument doesn't exist, create a new PrimitiveDefinition with this data.
     */
    create: XOR<PrimitiveDefinitionCreateInput, PrimitiveDefinitionUncheckedCreateInput>
    /**
     * In case the PrimitiveDefinition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PrimitiveDefinitionUpdateInput, PrimitiveDefinitionUncheckedUpdateInput>
  }

  /**
   * PrimitiveDefinition delete
   */
  export type PrimitiveDefinitionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrimitiveDefinition
     */
    select?: PrimitiveDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrimitiveDefinition
     */
    omit?: PrimitiveDefinitionOmit<ExtArgs> | null
    /**
     * Filter which PrimitiveDefinition to delete.
     */
    where: PrimitiveDefinitionWhereUniqueInput
  }

  /**
   * PrimitiveDefinition deleteMany
   */
  export type PrimitiveDefinitionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PrimitiveDefinitions to delete
     */
    where?: PrimitiveDefinitionWhereInput
    /**
     * Limit how many PrimitiveDefinitions to delete.
     */
    limit?: number
  }

  /**
   * PrimitiveDefinition without action
   */
  export type PrimitiveDefinitionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrimitiveDefinition
     */
    select?: PrimitiveDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrimitiveDefinition
     */
    omit?: PrimitiveDefinitionOmit<ExtArgs> | null
  }


  /**
   * Model RunEval
   */

  export type AggregateRunEval = {
    _count: RunEvalCountAggregateOutputType | null
    _avg: RunEvalAvgAggregateOutputType | null
    _sum: RunEvalSumAggregateOutputType | null
    _min: RunEvalMinAggregateOutputType | null
    _max: RunEvalMaxAggregateOutputType | null
  }

  export type RunEvalAvgAggregateOutputType = {
    score: number | null
  }

  export type RunEvalSumAggregateOutputType = {
    score: number | null
  }

  export type RunEvalMinAggregateOutputType = {
    id: string | null
    runId: string | null
    evalName: string | null
    score: number | null
    pass: boolean | null
    reasoning: string | null
    createdAt: Date | null
  }

  export type RunEvalMaxAggregateOutputType = {
    id: string | null
    runId: string | null
    evalName: string | null
    score: number | null
    pass: boolean | null
    reasoning: string | null
    createdAt: Date | null
  }

  export type RunEvalCountAggregateOutputType = {
    id: number
    runId: number
    evalName: number
    score: number
    pass: number
    reasoning: number
    meta: number
    createdAt: number
    _all: number
  }


  export type RunEvalAvgAggregateInputType = {
    score?: true
  }

  export type RunEvalSumAggregateInputType = {
    score?: true
  }

  export type RunEvalMinAggregateInputType = {
    id?: true
    runId?: true
    evalName?: true
    score?: true
    pass?: true
    reasoning?: true
    createdAt?: true
  }

  export type RunEvalMaxAggregateInputType = {
    id?: true
    runId?: true
    evalName?: true
    score?: true
    pass?: true
    reasoning?: true
    createdAt?: true
  }

  export type RunEvalCountAggregateInputType = {
    id?: true
    runId?: true
    evalName?: true
    score?: true
    pass?: true
    reasoning?: true
    meta?: true
    createdAt?: true
    _all?: true
  }

  export type RunEvalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RunEval to aggregate.
     */
    where?: RunEvalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunEvals to fetch.
     */
    orderBy?: RunEvalOrderByWithRelationInput | RunEvalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RunEvalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunEvals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunEvals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RunEvals
    **/
    _count?: true | RunEvalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RunEvalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RunEvalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RunEvalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RunEvalMaxAggregateInputType
  }

  export type GetRunEvalAggregateType<T extends RunEvalAggregateArgs> = {
        [P in keyof T & keyof AggregateRunEval]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRunEval[P]>
      : GetScalarType<T[P], AggregateRunEval[P]>
  }




  export type RunEvalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RunEvalWhereInput
    orderBy?: RunEvalOrderByWithAggregationInput | RunEvalOrderByWithAggregationInput[]
    by: RunEvalScalarFieldEnum[] | RunEvalScalarFieldEnum
    having?: RunEvalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RunEvalCountAggregateInputType | true
    _avg?: RunEvalAvgAggregateInputType
    _sum?: RunEvalSumAggregateInputType
    _min?: RunEvalMinAggregateInputType
    _max?: RunEvalMaxAggregateInputType
  }

  export type RunEvalGroupByOutputType = {
    id: string
    runId: string
    evalName: string
    score: number | null
    pass: boolean | null
    reasoning: string | null
    meta: JsonValue
    createdAt: Date
    _count: RunEvalCountAggregateOutputType | null
    _avg: RunEvalAvgAggregateOutputType | null
    _sum: RunEvalSumAggregateOutputType | null
    _min: RunEvalMinAggregateOutputType | null
    _max: RunEvalMaxAggregateOutputType | null
  }

  type GetRunEvalGroupByPayload<T extends RunEvalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RunEvalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RunEvalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RunEvalGroupByOutputType[P]>
            : GetScalarType<T[P], RunEvalGroupByOutputType[P]>
        }
      >
    >


  export type RunEvalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    evalName?: boolean
    score?: boolean
    pass?: boolean
    reasoning?: boolean
    meta?: boolean
    createdAt?: boolean
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["runEval"]>

  export type RunEvalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    evalName?: boolean
    score?: boolean
    pass?: boolean
    reasoning?: boolean
    meta?: boolean
    createdAt?: boolean
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["runEval"]>

  export type RunEvalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    evalName?: boolean
    score?: boolean
    pass?: boolean
    reasoning?: boolean
    meta?: boolean
    createdAt?: boolean
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["runEval"]>

  export type RunEvalSelectScalar = {
    id?: boolean
    runId?: boolean
    evalName?: boolean
    score?: boolean
    pass?: boolean
    reasoning?: boolean
    meta?: boolean
    createdAt?: boolean
  }

  export type RunEvalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "runId" | "evalName" | "score" | "pass" | "reasoning" | "meta" | "createdAt", ExtArgs["result"]["runEval"]>
  export type RunEvalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }
  export type RunEvalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }
  export type RunEvalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }

  export type $RunEvalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RunEval"
    objects: {
      run: Prisma.$AgentRunPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      runId: string
      evalName: string
      score: number | null
      pass: boolean | null
      reasoning: string | null
      meta: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["runEval"]>
    composites: {}
  }

  type RunEvalGetPayload<S extends boolean | null | undefined | RunEvalDefaultArgs> = $Result.GetResult<Prisma.$RunEvalPayload, S>

  type RunEvalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RunEvalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RunEvalCountAggregateInputType | true
    }

  export interface RunEvalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RunEval'], meta: { name: 'RunEval' } }
    /**
     * Find zero or one RunEval that matches the filter.
     * @param {RunEvalFindUniqueArgs} args - Arguments to find a RunEval
     * @example
     * // Get one RunEval
     * const runEval = await prisma.runEval.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RunEvalFindUniqueArgs>(args: SelectSubset<T, RunEvalFindUniqueArgs<ExtArgs>>): Prisma__RunEvalClient<$Result.GetResult<Prisma.$RunEvalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RunEval that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RunEvalFindUniqueOrThrowArgs} args - Arguments to find a RunEval
     * @example
     * // Get one RunEval
     * const runEval = await prisma.runEval.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RunEvalFindUniqueOrThrowArgs>(args: SelectSubset<T, RunEvalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RunEvalClient<$Result.GetResult<Prisma.$RunEvalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RunEval that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunEvalFindFirstArgs} args - Arguments to find a RunEval
     * @example
     * // Get one RunEval
     * const runEval = await prisma.runEval.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RunEvalFindFirstArgs>(args?: SelectSubset<T, RunEvalFindFirstArgs<ExtArgs>>): Prisma__RunEvalClient<$Result.GetResult<Prisma.$RunEvalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RunEval that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunEvalFindFirstOrThrowArgs} args - Arguments to find a RunEval
     * @example
     * // Get one RunEval
     * const runEval = await prisma.runEval.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RunEvalFindFirstOrThrowArgs>(args?: SelectSubset<T, RunEvalFindFirstOrThrowArgs<ExtArgs>>): Prisma__RunEvalClient<$Result.GetResult<Prisma.$RunEvalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RunEvals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunEvalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RunEvals
     * const runEvals = await prisma.runEval.findMany()
     * 
     * // Get first 10 RunEvals
     * const runEvals = await prisma.runEval.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const runEvalWithIdOnly = await prisma.runEval.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RunEvalFindManyArgs>(args?: SelectSubset<T, RunEvalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunEvalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RunEval.
     * @param {RunEvalCreateArgs} args - Arguments to create a RunEval.
     * @example
     * // Create one RunEval
     * const RunEval = await prisma.runEval.create({
     *   data: {
     *     // ... data to create a RunEval
     *   }
     * })
     * 
     */
    create<T extends RunEvalCreateArgs>(args: SelectSubset<T, RunEvalCreateArgs<ExtArgs>>): Prisma__RunEvalClient<$Result.GetResult<Prisma.$RunEvalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RunEvals.
     * @param {RunEvalCreateManyArgs} args - Arguments to create many RunEvals.
     * @example
     * // Create many RunEvals
     * const runEval = await prisma.runEval.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RunEvalCreateManyArgs>(args?: SelectSubset<T, RunEvalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RunEvals and returns the data saved in the database.
     * @param {RunEvalCreateManyAndReturnArgs} args - Arguments to create many RunEvals.
     * @example
     * // Create many RunEvals
     * const runEval = await prisma.runEval.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RunEvals and only return the `id`
     * const runEvalWithIdOnly = await prisma.runEval.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RunEvalCreateManyAndReturnArgs>(args?: SelectSubset<T, RunEvalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunEvalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RunEval.
     * @param {RunEvalDeleteArgs} args - Arguments to delete one RunEval.
     * @example
     * // Delete one RunEval
     * const RunEval = await prisma.runEval.delete({
     *   where: {
     *     // ... filter to delete one RunEval
     *   }
     * })
     * 
     */
    delete<T extends RunEvalDeleteArgs>(args: SelectSubset<T, RunEvalDeleteArgs<ExtArgs>>): Prisma__RunEvalClient<$Result.GetResult<Prisma.$RunEvalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RunEval.
     * @param {RunEvalUpdateArgs} args - Arguments to update one RunEval.
     * @example
     * // Update one RunEval
     * const runEval = await prisma.runEval.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RunEvalUpdateArgs>(args: SelectSubset<T, RunEvalUpdateArgs<ExtArgs>>): Prisma__RunEvalClient<$Result.GetResult<Prisma.$RunEvalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RunEvals.
     * @param {RunEvalDeleteManyArgs} args - Arguments to filter RunEvals to delete.
     * @example
     * // Delete a few RunEvals
     * const { count } = await prisma.runEval.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RunEvalDeleteManyArgs>(args?: SelectSubset<T, RunEvalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RunEvals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunEvalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RunEvals
     * const runEval = await prisma.runEval.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RunEvalUpdateManyArgs>(args: SelectSubset<T, RunEvalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RunEvals and returns the data updated in the database.
     * @param {RunEvalUpdateManyAndReturnArgs} args - Arguments to update many RunEvals.
     * @example
     * // Update many RunEvals
     * const runEval = await prisma.runEval.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RunEvals and only return the `id`
     * const runEvalWithIdOnly = await prisma.runEval.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RunEvalUpdateManyAndReturnArgs>(args: SelectSubset<T, RunEvalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunEvalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RunEval.
     * @param {RunEvalUpsertArgs} args - Arguments to update or create a RunEval.
     * @example
     * // Update or create a RunEval
     * const runEval = await prisma.runEval.upsert({
     *   create: {
     *     // ... data to create a RunEval
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RunEval we want to update
     *   }
     * })
     */
    upsert<T extends RunEvalUpsertArgs>(args: SelectSubset<T, RunEvalUpsertArgs<ExtArgs>>): Prisma__RunEvalClient<$Result.GetResult<Prisma.$RunEvalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RunEvals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunEvalCountArgs} args - Arguments to filter RunEvals to count.
     * @example
     * // Count the number of RunEvals
     * const count = await prisma.runEval.count({
     *   where: {
     *     // ... the filter for the RunEvals we want to count
     *   }
     * })
    **/
    count<T extends RunEvalCountArgs>(
      args?: Subset<T, RunEvalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RunEvalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RunEval.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunEvalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RunEvalAggregateArgs>(args: Subset<T, RunEvalAggregateArgs>): Prisma.PrismaPromise<GetRunEvalAggregateType<T>>

    /**
     * Group by RunEval.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunEvalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RunEvalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RunEvalGroupByArgs['orderBy'] }
        : { orderBy?: RunEvalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RunEvalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRunEvalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RunEval model
   */
  readonly fields: RunEvalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RunEval.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RunEvalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    run<T extends AgentRunDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgentRunDefaultArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RunEval model
   */
  interface RunEvalFieldRefs {
    readonly id: FieldRef<"RunEval", 'String'>
    readonly runId: FieldRef<"RunEval", 'String'>
    readonly evalName: FieldRef<"RunEval", 'String'>
    readonly score: FieldRef<"RunEval", 'Float'>
    readonly pass: FieldRef<"RunEval", 'Boolean'>
    readonly reasoning: FieldRef<"RunEval", 'String'>
    readonly meta: FieldRef<"RunEval", 'Json'>
    readonly createdAt: FieldRef<"RunEval", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RunEval findUnique
   */
  export type RunEvalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalInclude<ExtArgs> | null
    /**
     * Filter, which RunEval to fetch.
     */
    where: RunEvalWhereUniqueInput
  }

  /**
   * RunEval findUniqueOrThrow
   */
  export type RunEvalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalInclude<ExtArgs> | null
    /**
     * Filter, which RunEval to fetch.
     */
    where: RunEvalWhereUniqueInput
  }

  /**
   * RunEval findFirst
   */
  export type RunEvalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalInclude<ExtArgs> | null
    /**
     * Filter, which RunEval to fetch.
     */
    where?: RunEvalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunEvals to fetch.
     */
    orderBy?: RunEvalOrderByWithRelationInput | RunEvalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RunEvals.
     */
    cursor?: RunEvalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunEvals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunEvals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RunEvals.
     */
    distinct?: RunEvalScalarFieldEnum | RunEvalScalarFieldEnum[]
  }

  /**
   * RunEval findFirstOrThrow
   */
  export type RunEvalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalInclude<ExtArgs> | null
    /**
     * Filter, which RunEval to fetch.
     */
    where?: RunEvalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunEvals to fetch.
     */
    orderBy?: RunEvalOrderByWithRelationInput | RunEvalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RunEvals.
     */
    cursor?: RunEvalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunEvals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunEvals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RunEvals.
     */
    distinct?: RunEvalScalarFieldEnum | RunEvalScalarFieldEnum[]
  }

  /**
   * RunEval findMany
   */
  export type RunEvalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalInclude<ExtArgs> | null
    /**
     * Filter, which RunEvals to fetch.
     */
    where?: RunEvalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunEvals to fetch.
     */
    orderBy?: RunEvalOrderByWithRelationInput | RunEvalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RunEvals.
     */
    cursor?: RunEvalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunEvals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunEvals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RunEvals.
     */
    distinct?: RunEvalScalarFieldEnum | RunEvalScalarFieldEnum[]
  }

  /**
   * RunEval create
   */
  export type RunEvalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalInclude<ExtArgs> | null
    /**
     * The data needed to create a RunEval.
     */
    data: XOR<RunEvalCreateInput, RunEvalUncheckedCreateInput>
  }

  /**
   * RunEval createMany
   */
  export type RunEvalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RunEvals.
     */
    data: RunEvalCreateManyInput | RunEvalCreateManyInput[]
  }

  /**
   * RunEval createManyAndReturn
   */
  export type RunEvalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * The data used to create many RunEvals.
     */
    data: RunEvalCreateManyInput | RunEvalCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RunEval update
   */
  export type RunEvalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalInclude<ExtArgs> | null
    /**
     * The data needed to update a RunEval.
     */
    data: XOR<RunEvalUpdateInput, RunEvalUncheckedUpdateInput>
    /**
     * Choose, which RunEval to update.
     */
    where: RunEvalWhereUniqueInput
  }

  /**
   * RunEval updateMany
   */
  export type RunEvalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RunEvals.
     */
    data: XOR<RunEvalUpdateManyMutationInput, RunEvalUncheckedUpdateManyInput>
    /**
     * Filter which RunEvals to update
     */
    where?: RunEvalWhereInput
    /**
     * Limit how many RunEvals to update.
     */
    limit?: number
  }

  /**
   * RunEval updateManyAndReturn
   */
  export type RunEvalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * The data used to update RunEvals.
     */
    data: XOR<RunEvalUpdateManyMutationInput, RunEvalUncheckedUpdateManyInput>
    /**
     * Filter which RunEvals to update
     */
    where?: RunEvalWhereInput
    /**
     * Limit how many RunEvals to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RunEval upsert
   */
  export type RunEvalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalInclude<ExtArgs> | null
    /**
     * The filter to search for the RunEval to update in case it exists.
     */
    where: RunEvalWhereUniqueInput
    /**
     * In case the RunEval found by the `where` argument doesn't exist, create a new RunEval with this data.
     */
    create: XOR<RunEvalCreateInput, RunEvalUncheckedCreateInput>
    /**
     * In case the RunEval was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RunEvalUpdateInput, RunEvalUncheckedUpdateInput>
  }

  /**
   * RunEval delete
   */
  export type RunEvalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalInclude<ExtArgs> | null
    /**
     * Filter which RunEval to delete.
     */
    where: RunEvalWhereUniqueInput
  }

  /**
   * RunEval deleteMany
   */
  export type RunEvalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RunEvals to delete
     */
    where?: RunEvalWhereInput
    /**
     * Limit how many RunEvals to delete.
     */
    limit?: number
  }

  /**
   * RunEval without action
   */
  export type RunEvalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunEval
     */
    select?: RunEvalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunEval
     */
    omit?: RunEvalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunEvalInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AgentDefinitionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    kind: 'kind',
    instructions: 'instructions',
    allowedTools: 'allowedTools',
    defaultModel: 'defaultModel',
    outputSchema: 'outputSchema',
    flowDefinition: 'flowDefinition',
    mode: 'mode',
    publishToken: 'publishToken',
    publishedAt: 'publishedAt',
    meta: 'meta',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AgentDefinitionScalarFieldEnum = (typeof AgentDefinitionScalarFieldEnum)[keyof typeof AgentDefinitionScalarFieldEnum]


  export const AgentVersionScalarFieldEnum: {
    id: 'id',
    agentDefinitionId: 'agentDefinitionId',
    version: 'version',
    instructions: 'instructions',
    allowedTools: 'allowedTools',
    defaultModel: 'defaultModel',
    outputSchema: 'outputSchema',
    flowDefinition: 'flowDefinition',
    changelog: 'changelog',
    createdAt: 'createdAt'
  };

  export type AgentVersionScalarFieldEnum = (typeof AgentVersionScalarFieldEnum)[keyof typeof AgentVersionScalarFieldEnum]


  export const AgentRunScalarFieldEnum: {
    id: 'id',
    agentDefinitionId: 'agentDefinitionId',
    agentVersionId: 'agentVersionId',
    sessionId: 'sessionId',
    status: 'status',
    input: 'input',
    finalOutput: 'finalOutput',
    tokenUsage: 'tokenUsage',
    costEstimate: 'costEstimate',
    durationMs: 'durationMs',
    error: 'error',
    triggeredBy: 'triggeredBy',
    meta: 'meta',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AgentRunScalarFieldEnum = (typeof AgentRunScalarFieldEnum)[keyof typeof AgentRunScalarFieldEnum]


  export const ConversationSessionScalarFieldEnum: {
    id: 'id',
    agentDefinitionId: 'agentDefinitionId',
    status: 'status',
    participantId: 'participantId',
    meta: 'meta',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConversationSessionScalarFieldEnum = (typeof ConversationSessionScalarFieldEnum)[keyof typeof ConversationSessionScalarFieldEnum]


  export const RunStepScalarFieldEnum: {
    id: 'id',
    runId: 'runId',
    stepIndex: 'stepIndex',
    kind: 'kind',
    status: 'status',
    toolName: 'toolName',
    nodeId: 'nodeId',
    input: 'input',
    output: 'output',
    tokenUsage: 'tokenUsage',
    durationMs: 'durationMs',
    error: 'error',
    validationPassed: 'validationPassed',
    createdAt: 'createdAt'
  };

  export type RunStepScalarFieldEnum = (typeof RunStepScalarFieldEnum)[keyof typeof RunStepScalarFieldEnum]


  export const RunArtifactScalarFieldEnum: {
    id: 'id',
    runId: 'runId',
    kind: 'kind',
    targetType: 'targetType',
    targetId: 'targetId',
    data: 'data',
    previousData: 'previousData',
    appliedAt: 'appliedAt',
    appliedBy: 'appliedBy',
    rejected: 'rejected',
    rejectedReason: 'rejectedReason',
    rejectedAt: 'rejectedAt',
    rejectedBy: 'rejectedBy',
    proposalOutcome: 'proposalOutcome',
    ignoredAt: 'ignoredAt',
    createdAt: 'createdAt'
  };

  export type RunArtifactScalarFieldEnum = (typeof RunArtifactScalarFieldEnum)[keyof typeof RunArtifactScalarFieldEnum]


  export const PrimitiveDefinitionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    kind: 'kind',
    description: 'description',
    instructions: 'instructions',
    config: 'config',
    allowedTools: 'allowedTools',
    defaultModel: 'defaultModel',
    meta: 'meta',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PrimitiveDefinitionScalarFieldEnum = (typeof PrimitiveDefinitionScalarFieldEnum)[keyof typeof PrimitiveDefinitionScalarFieldEnum]


  export const RunEvalScalarFieldEnum: {
    id: 'id',
    runId: 'runId',
    evalName: 'evalName',
    score: 'score',
    pass: 'pass',
    reasoning: 'reasoning',
    meta: 'meta',
    createdAt: 'createdAt'
  };

  export type RunEvalScalarFieldEnum = (typeof RunEvalScalarFieldEnum)[keyof typeof RunEvalScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type AgentDefinitionWhereInput = {
    AND?: AgentDefinitionWhereInput | AgentDefinitionWhereInput[]
    OR?: AgentDefinitionWhereInput[]
    NOT?: AgentDefinitionWhereInput | AgentDefinitionWhereInput[]
    id?: StringFilter<"AgentDefinition"> | string
    name?: StringFilter<"AgentDefinition"> | string
    slug?: StringFilter<"AgentDefinition"> | string
    description?: StringFilter<"AgentDefinition"> | string
    kind?: StringFilter<"AgentDefinition"> | string
    instructions?: StringFilter<"AgentDefinition"> | string
    allowedTools?: JsonFilter<"AgentDefinition">
    defaultModel?: StringFilter<"AgentDefinition"> | string
    outputSchema?: JsonNullableFilter<"AgentDefinition">
    flowDefinition?: JsonNullableFilter<"AgentDefinition">
    mode?: StringFilter<"AgentDefinition"> | string
    publishToken?: StringNullableFilter<"AgentDefinition"> | string | null
    publishedAt?: DateTimeNullableFilter<"AgentDefinition"> | Date | string | null
    meta?: JsonFilter<"AgentDefinition">
    createdAt?: DateTimeFilter<"AgentDefinition"> | Date | string
    updatedAt?: DateTimeFilter<"AgentDefinition"> | Date | string
    versions?: AgentVersionListRelationFilter
    runs?: AgentRunListRelationFilter
    sessions?: ConversationSessionListRelationFilter
  }

  export type AgentDefinitionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    kind?: SortOrder
    instructions?: SortOrder
    allowedTools?: SortOrder
    defaultModel?: SortOrder
    outputSchema?: SortOrderInput | SortOrder
    flowDefinition?: SortOrderInput | SortOrder
    mode?: SortOrder
    publishToken?: SortOrderInput | SortOrder
    publishedAt?: SortOrderInput | SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    versions?: AgentVersionOrderByRelationAggregateInput
    runs?: AgentRunOrderByRelationAggregateInput
    sessions?: ConversationSessionOrderByRelationAggregateInput
  }

  export type AgentDefinitionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    publishToken?: string
    AND?: AgentDefinitionWhereInput | AgentDefinitionWhereInput[]
    OR?: AgentDefinitionWhereInput[]
    NOT?: AgentDefinitionWhereInput | AgentDefinitionWhereInput[]
    name?: StringFilter<"AgentDefinition"> | string
    description?: StringFilter<"AgentDefinition"> | string
    kind?: StringFilter<"AgentDefinition"> | string
    instructions?: StringFilter<"AgentDefinition"> | string
    allowedTools?: JsonFilter<"AgentDefinition">
    defaultModel?: StringFilter<"AgentDefinition"> | string
    outputSchema?: JsonNullableFilter<"AgentDefinition">
    flowDefinition?: JsonNullableFilter<"AgentDefinition">
    mode?: StringFilter<"AgentDefinition"> | string
    publishedAt?: DateTimeNullableFilter<"AgentDefinition"> | Date | string | null
    meta?: JsonFilter<"AgentDefinition">
    createdAt?: DateTimeFilter<"AgentDefinition"> | Date | string
    updatedAt?: DateTimeFilter<"AgentDefinition"> | Date | string
    versions?: AgentVersionListRelationFilter
    runs?: AgentRunListRelationFilter
    sessions?: ConversationSessionListRelationFilter
  }, "id" | "slug" | "publishToken">

  export type AgentDefinitionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    kind?: SortOrder
    instructions?: SortOrder
    allowedTools?: SortOrder
    defaultModel?: SortOrder
    outputSchema?: SortOrderInput | SortOrder
    flowDefinition?: SortOrderInput | SortOrder
    mode?: SortOrder
    publishToken?: SortOrderInput | SortOrder
    publishedAt?: SortOrderInput | SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AgentDefinitionCountOrderByAggregateInput
    _max?: AgentDefinitionMaxOrderByAggregateInput
    _min?: AgentDefinitionMinOrderByAggregateInput
  }

  export type AgentDefinitionScalarWhereWithAggregatesInput = {
    AND?: AgentDefinitionScalarWhereWithAggregatesInput | AgentDefinitionScalarWhereWithAggregatesInput[]
    OR?: AgentDefinitionScalarWhereWithAggregatesInput[]
    NOT?: AgentDefinitionScalarWhereWithAggregatesInput | AgentDefinitionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentDefinition"> | string
    name?: StringWithAggregatesFilter<"AgentDefinition"> | string
    slug?: StringWithAggregatesFilter<"AgentDefinition"> | string
    description?: StringWithAggregatesFilter<"AgentDefinition"> | string
    kind?: StringWithAggregatesFilter<"AgentDefinition"> | string
    instructions?: StringWithAggregatesFilter<"AgentDefinition"> | string
    allowedTools?: JsonWithAggregatesFilter<"AgentDefinition">
    defaultModel?: StringWithAggregatesFilter<"AgentDefinition"> | string
    outputSchema?: JsonNullableWithAggregatesFilter<"AgentDefinition">
    flowDefinition?: JsonNullableWithAggregatesFilter<"AgentDefinition">
    mode?: StringWithAggregatesFilter<"AgentDefinition"> | string
    publishToken?: StringNullableWithAggregatesFilter<"AgentDefinition"> | string | null
    publishedAt?: DateTimeNullableWithAggregatesFilter<"AgentDefinition"> | Date | string | null
    meta?: JsonWithAggregatesFilter<"AgentDefinition">
    createdAt?: DateTimeWithAggregatesFilter<"AgentDefinition"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AgentDefinition"> | Date | string
  }

  export type AgentVersionWhereInput = {
    AND?: AgentVersionWhereInput | AgentVersionWhereInput[]
    OR?: AgentVersionWhereInput[]
    NOT?: AgentVersionWhereInput | AgentVersionWhereInput[]
    id?: StringFilter<"AgentVersion"> | string
    agentDefinitionId?: StringFilter<"AgentVersion"> | string
    version?: IntFilter<"AgentVersion"> | number
    instructions?: StringFilter<"AgentVersion"> | string
    allowedTools?: JsonFilter<"AgentVersion">
    defaultModel?: StringFilter<"AgentVersion"> | string
    outputSchema?: JsonNullableFilter<"AgentVersion">
    flowDefinition?: JsonNullableFilter<"AgentVersion">
    changelog?: StringFilter<"AgentVersion"> | string
    createdAt?: DateTimeFilter<"AgentVersion"> | Date | string
    agentDefinition?: XOR<AgentDefinitionScalarRelationFilter, AgentDefinitionWhereInput>
  }

  export type AgentVersionOrderByWithRelationInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    version?: SortOrder
    instructions?: SortOrder
    allowedTools?: SortOrder
    defaultModel?: SortOrder
    outputSchema?: SortOrderInput | SortOrder
    flowDefinition?: SortOrderInput | SortOrder
    changelog?: SortOrder
    createdAt?: SortOrder
    agentDefinition?: AgentDefinitionOrderByWithRelationInput
  }

  export type AgentVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    agentDefinitionId_version?: AgentVersionAgentDefinitionIdVersionCompoundUniqueInput
    AND?: AgentVersionWhereInput | AgentVersionWhereInput[]
    OR?: AgentVersionWhereInput[]
    NOT?: AgentVersionWhereInput | AgentVersionWhereInput[]
    agentDefinitionId?: StringFilter<"AgentVersion"> | string
    version?: IntFilter<"AgentVersion"> | number
    instructions?: StringFilter<"AgentVersion"> | string
    allowedTools?: JsonFilter<"AgentVersion">
    defaultModel?: StringFilter<"AgentVersion"> | string
    outputSchema?: JsonNullableFilter<"AgentVersion">
    flowDefinition?: JsonNullableFilter<"AgentVersion">
    changelog?: StringFilter<"AgentVersion"> | string
    createdAt?: DateTimeFilter<"AgentVersion"> | Date | string
    agentDefinition?: XOR<AgentDefinitionScalarRelationFilter, AgentDefinitionWhereInput>
  }, "id" | "agentDefinitionId_version">

  export type AgentVersionOrderByWithAggregationInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    version?: SortOrder
    instructions?: SortOrder
    allowedTools?: SortOrder
    defaultModel?: SortOrder
    outputSchema?: SortOrderInput | SortOrder
    flowDefinition?: SortOrderInput | SortOrder
    changelog?: SortOrder
    createdAt?: SortOrder
    _count?: AgentVersionCountOrderByAggregateInput
    _avg?: AgentVersionAvgOrderByAggregateInput
    _max?: AgentVersionMaxOrderByAggregateInput
    _min?: AgentVersionMinOrderByAggregateInput
    _sum?: AgentVersionSumOrderByAggregateInput
  }

  export type AgentVersionScalarWhereWithAggregatesInput = {
    AND?: AgentVersionScalarWhereWithAggregatesInput | AgentVersionScalarWhereWithAggregatesInput[]
    OR?: AgentVersionScalarWhereWithAggregatesInput[]
    NOT?: AgentVersionScalarWhereWithAggregatesInput | AgentVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentVersion"> | string
    agentDefinitionId?: StringWithAggregatesFilter<"AgentVersion"> | string
    version?: IntWithAggregatesFilter<"AgentVersion"> | number
    instructions?: StringWithAggregatesFilter<"AgentVersion"> | string
    allowedTools?: JsonWithAggregatesFilter<"AgentVersion">
    defaultModel?: StringWithAggregatesFilter<"AgentVersion"> | string
    outputSchema?: JsonNullableWithAggregatesFilter<"AgentVersion">
    flowDefinition?: JsonNullableWithAggregatesFilter<"AgentVersion">
    changelog?: StringWithAggregatesFilter<"AgentVersion"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AgentVersion"> | Date | string
  }

  export type AgentRunWhereInput = {
    AND?: AgentRunWhereInput | AgentRunWhereInput[]
    OR?: AgentRunWhereInput[]
    NOT?: AgentRunWhereInput | AgentRunWhereInput[]
    id?: StringFilter<"AgentRun"> | string
    agentDefinitionId?: StringFilter<"AgentRun"> | string
    agentVersionId?: StringNullableFilter<"AgentRun"> | string | null
    sessionId?: StringNullableFilter<"AgentRun"> | string | null
    status?: StringFilter<"AgentRun"> | string
    input?: StringFilter<"AgentRun"> | string
    finalOutput?: StringNullableFilter<"AgentRun"> | string | null
    tokenUsage?: JsonNullableFilter<"AgentRun">
    costEstimate?: FloatNullableFilter<"AgentRun"> | number | null
    durationMs?: IntNullableFilter<"AgentRun"> | number | null
    error?: StringNullableFilter<"AgentRun"> | string | null
    triggeredBy?: StringFilter<"AgentRun"> | string
    meta?: JsonFilter<"AgentRun">
    createdAt?: DateTimeFilter<"AgentRun"> | Date | string
    updatedAt?: DateTimeFilter<"AgentRun"> | Date | string
    agentDefinition?: XOR<AgentDefinitionScalarRelationFilter, AgentDefinitionWhereInput>
    session?: XOR<ConversationSessionNullableScalarRelationFilter, ConversationSessionWhereInput> | null
    steps?: RunStepListRelationFilter
    artifacts?: RunArtifactListRelationFilter
    evals?: RunEvalListRelationFilter
  }

  export type AgentRunOrderByWithRelationInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    agentVersionId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    status?: SortOrder
    input?: SortOrder
    finalOutput?: SortOrderInput | SortOrder
    tokenUsage?: SortOrderInput | SortOrder
    costEstimate?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    triggeredBy?: SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    agentDefinition?: AgentDefinitionOrderByWithRelationInput
    session?: ConversationSessionOrderByWithRelationInput
    steps?: RunStepOrderByRelationAggregateInput
    artifacts?: RunArtifactOrderByRelationAggregateInput
    evals?: RunEvalOrderByRelationAggregateInput
  }

  export type AgentRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AgentRunWhereInput | AgentRunWhereInput[]
    OR?: AgentRunWhereInput[]
    NOT?: AgentRunWhereInput | AgentRunWhereInput[]
    agentDefinitionId?: StringFilter<"AgentRun"> | string
    agentVersionId?: StringNullableFilter<"AgentRun"> | string | null
    sessionId?: StringNullableFilter<"AgentRun"> | string | null
    status?: StringFilter<"AgentRun"> | string
    input?: StringFilter<"AgentRun"> | string
    finalOutput?: StringNullableFilter<"AgentRun"> | string | null
    tokenUsage?: JsonNullableFilter<"AgentRun">
    costEstimate?: FloatNullableFilter<"AgentRun"> | number | null
    durationMs?: IntNullableFilter<"AgentRun"> | number | null
    error?: StringNullableFilter<"AgentRun"> | string | null
    triggeredBy?: StringFilter<"AgentRun"> | string
    meta?: JsonFilter<"AgentRun">
    createdAt?: DateTimeFilter<"AgentRun"> | Date | string
    updatedAt?: DateTimeFilter<"AgentRun"> | Date | string
    agentDefinition?: XOR<AgentDefinitionScalarRelationFilter, AgentDefinitionWhereInput>
    session?: XOR<ConversationSessionNullableScalarRelationFilter, ConversationSessionWhereInput> | null
    steps?: RunStepListRelationFilter
    artifacts?: RunArtifactListRelationFilter
    evals?: RunEvalListRelationFilter
  }, "id">

  export type AgentRunOrderByWithAggregationInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    agentVersionId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    status?: SortOrder
    input?: SortOrder
    finalOutput?: SortOrderInput | SortOrder
    tokenUsage?: SortOrderInput | SortOrder
    costEstimate?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    triggeredBy?: SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AgentRunCountOrderByAggregateInput
    _avg?: AgentRunAvgOrderByAggregateInput
    _max?: AgentRunMaxOrderByAggregateInput
    _min?: AgentRunMinOrderByAggregateInput
    _sum?: AgentRunSumOrderByAggregateInput
  }

  export type AgentRunScalarWhereWithAggregatesInput = {
    AND?: AgentRunScalarWhereWithAggregatesInput | AgentRunScalarWhereWithAggregatesInput[]
    OR?: AgentRunScalarWhereWithAggregatesInput[]
    NOT?: AgentRunScalarWhereWithAggregatesInput | AgentRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentRun"> | string
    agentDefinitionId?: StringWithAggregatesFilter<"AgentRun"> | string
    agentVersionId?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    sessionId?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    status?: StringWithAggregatesFilter<"AgentRun"> | string
    input?: StringWithAggregatesFilter<"AgentRun"> | string
    finalOutput?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    tokenUsage?: JsonNullableWithAggregatesFilter<"AgentRun">
    costEstimate?: FloatNullableWithAggregatesFilter<"AgentRun"> | number | null
    durationMs?: IntNullableWithAggregatesFilter<"AgentRun"> | number | null
    error?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    triggeredBy?: StringWithAggregatesFilter<"AgentRun"> | string
    meta?: JsonWithAggregatesFilter<"AgentRun">
    createdAt?: DateTimeWithAggregatesFilter<"AgentRun"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AgentRun"> | Date | string
  }

  export type ConversationSessionWhereInput = {
    AND?: ConversationSessionWhereInput | ConversationSessionWhereInput[]
    OR?: ConversationSessionWhereInput[]
    NOT?: ConversationSessionWhereInput | ConversationSessionWhereInput[]
    id?: StringFilter<"ConversationSession"> | string
    agentDefinitionId?: StringFilter<"ConversationSession"> | string
    status?: StringFilter<"ConversationSession"> | string
    participantId?: StringNullableFilter<"ConversationSession"> | string | null
    meta?: JsonFilter<"ConversationSession">
    createdAt?: DateTimeFilter<"ConversationSession"> | Date | string
    updatedAt?: DateTimeFilter<"ConversationSession"> | Date | string
    agentDefinition?: XOR<AgentDefinitionScalarRelationFilter, AgentDefinitionWhereInput>
    runs?: AgentRunListRelationFilter
  }

  export type ConversationSessionOrderByWithRelationInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    status?: SortOrder
    participantId?: SortOrderInput | SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    agentDefinition?: AgentDefinitionOrderByWithRelationInput
    runs?: AgentRunOrderByRelationAggregateInput
  }

  export type ConversationSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConversationSessionWhereInput | ConversationSessionWhereInput[]
    OR?: ConversationSessionWhereInput[]
    NOT?: ConversationSessionWhereInput | ConversationSessionWhereInput[]
    agentDefinitionId?: StringFilter<"ConversationSession"> | string
    status?: StringFilter<"ConversationSession"> | string
    participantId?: StringNullableFilter<"ConversationSession"> | string | null
    meta?: JsonFilter<"ConversationSession">
    createdAt?: DateTimeFilter<"ConversationSession"> | Date | string
    updatedAt?: DateTimeFilter<"ConversationSession"> | Date | string
    agentDefinition?: XOR<AgentDefinitionScalarRelationFilter, AgentDefinitionWhereInput>
    runs?: AgentRunListRelationFilter
  }, "id">

  export type ConversationSessionOrderByWithAggregationInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    status?: SortOrder
    participantId?: SortOrderInput | SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConversationSessionCountOrderByAggregateInput
    _max?: ConversationSessionMaxOrderByAggregateInput
    _min?: ConversationSessionMinOrderByAggregateInput
  }

  export type ConversationSessionScalarWhereWithAggregatesInput = {
    AND?: ConversationSessionScalarWhereWithAggregatesInput | ConversationSessionScalarWhereWithAggregatesInput[]
    OR?: ConversationSessionScalarWhereWithAggregatesInput[]
    NOT?: ConversationSessionScalarWhereWithAggregatesInput | ConversationSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConversationSession"> | string
    agentDefinitionId?: StringWithAggregatesFilter<"ConversationSession"> | string
    status?: StringWithAggregatesFilter<"ConversationSession"> | string
    participantId?: StringNullableWithAggregatesFilter<"ConversationSession"> | string | null
    meta?: JsonWithAggregatesFilter<"ConversationSession">
    createdAt?: DateTimeWithAggregatesFilter<"ConversationSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ConversationSession"> | Date | string
  }

  export type RunStepWhereInput = {
    AND?: RunStepWhereInput | RunStepWhereInput[]
    OR?: RunStepWhereInput[]
    NOT?: RunStepWhereInput | RunStepWhereInput[]
    id?: StringFilter<"RunStep"> | string
    runId?: StringFilter<"RunStep"> | string
    stepIndex?: IntFilter<"RunStep"> | number
    kind?: StringFilter<"RunStep"> | string
    status?: StringFilter<"RunStep"> | string
    toolName?: StringNullableFilter<"RunStep"> | string | null
    nodeId?: StringNullableFilter<"RunStep"> | string | null
    input?: JsonFilter<"RunStep">
    output?: JsonNullableFilter<"RunStep">
    tokenUsage?: JsonNullableFilter<"RunStep">
    durationMs?: IntNullableFilter<"RunStep"> | number | null
    error?: StringNullableFilter<"RunStep"> | string | null
    validationPassed?: BoolNullableFilter<"RunStep"> | boolean | null
    createdAt?: DateTimeFilter<"RunStep"> | Date | string
    run?: XOR<AgentRunScalarRelationFilter, AgentRunWhereInput>
  }

  export type RunStepOrderByWithRelationInput = {
    id?: SortOrder
    runId?: SortOrder
    stepIndex?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    toolName?: SortOrderInput | SortOrder
    nodeId?: SortOrderInput | SortOrder
    input?: SortOrder
    output?: SortOrderInput | SortOrder
    tokenUsage?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    validationPassed?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    run?: AgentRunOrderByWithRelationInput
  }

  export type RunStepWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RunStepWhereInput | RunStepWhereInput[]
    OR?: RunStepWhereInput[]
    NOT?: RunStepWhereInput | RunStepWhereInput[]
    runId?: StringFilter<"RunStep"> | string
    stepIndex?: IntFilter<"RunStep"> | number
    kind?: StringFilter<"RunStep"> | string
    status?: StringFilter<"RunStep"> | string
    toolName?: StringNullableFilter<"RunStep"> | string | null
    nodeId?: StringNullableFilter<"RunStep"> | string | null
    input?: JsonFilter<"RunStep">
    output?: JsonNullableFilter<"RunStep">
    tokenUsage?: JsonNullableFilter<"RunStep">
    durationMs?: IntNullableFilter<"RunStep"> | number | null
    error?: StringNullableFilter<"RunStep"> | string | null
    validationPassed?: BoolNullableFilter<"RunStep"> | boolean | null
    createdAt?: DateTimeFilter<"RunStep"> | Date | string
    run?: XOR<AgentRunScalarRelationFilter, AgentRunWhereInput>
  }, "id">

  export type RunStepOrderByWithAggregationInput = {
    id?: SortOrder
    runId?: SortOrder
    stepIndex?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    toolName?: SortOrderInput | SortOrder
    nodeId?: SortOrderInput | SortOrder
    input?: SortOrder
    output?: SortOrderInput | SortOrder
    tokenUsage?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    validationPassed?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RunStepCountOrderByAggregateInput
    _avg?: RunStepAvgOrderByAggregateInput
    _max?: RunStepMaxOrderByAggregateInput
    _min?: RunStepMinOrderByAggregateInput
    _sum?: RunStepSumOrderByAggregateInput
  }

  export type RunStepScalarWhereWithAggregatesInput = {
    AND?: RunStepScalarWhereWithAggregatesInput | RunStepScalarWhereWithAggregatesInput[]
    OR?: RunStepScalarWhereWithAggregatesInput[]
    NOT?: RunStepScalarWhereWithAggregatesInput | RunStepScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RunStep"> | string
    runId?: StringWithAggregatesFilter<"RunStep"> | string
    stepIndex?: IntWithAggregatesFilter<"RunStep"> | number
    kind?: StringWithAggregatesFilter<"RunStep"> | string
    status?: StringWithAggregatesFilter<"RunStep"> | string
    toolName?: StringNullableWithAggregatesFilter<"RunStep"> | string | null
    nodeId?: StringNullableWithAggregatesFilter<"RunStep"> | string | null
    input?: JsonWithAggregatesFilter<"RunStep">
    output?: JsonNullableWithAggregatesFilter<"RunStep">
    tokenUsage?: JsonNullableWithAggregatesFilter<"RunStep">
    durationMs?: IntNullableWithAggregatesFilter<"RunStep"> | number | null
    error?: StringNullableWithAggregatesFilter<"RunStep"> | string | null
    validationPassed?: BoolNullableWithAggregatesFilter<"RunStep"> | boolean | null
    createdAt?: DateTimeWithAggregatesFilter<"RunStep"> | Date | string
  }

  export type RunArtifactWhereInput = {
    AND?: RunArtifactWhereInput | RunArtifactWhereInput[]
    OR?: RunArtifactWhereInput[]
    NOT?: RunArtifactWhereInput | RunArtifactWhereInput[]
    id?: StringFilter<"RunArtifact"> | string
    runId?: StringFilter<"RunArtifact"> | string
    kind?: StringFilter<"RunArtifact"> | string
    targetType?: StringNullableFilter<"RunArtifact"> | string | null
    targetId?: StringNullableFilter<"RunArtifact"> | string | null
    data?: JsonFilter<"RunArtifact">
    previousData?: JsonNullableFilter<"RunArtifact">
    appliedAt?: DateTimeNullableFilter<"RunArtifact"> | Date | string | null
    appliedBy?: StringNullableFilter<"RunArtifact"> | string | null
    rejected?: BoolFilter<"RunArtifact"> | boolean
    rejectedReason?: StringNullableFilter<"RunArtifact"> | string | null
    rejectedAt?: DateTimeNullableFilter<"RunArtifact"> | Date | string | null
    rejectedBy?: StringNullableFilter<"RunArtifact"> | string | null
    proposalOutcome?: JsonNullableFilter<"RunArtifact">
    ignoredAt?: DateTimeNullableFilter<"RunArtifact"> | Date | string | null
    createdAt?: DateTimeFilter<"RunArtifact"> | Date | string
    run?: XOR<AgentRunScalarRelationFilter, AgentRunWhereInput>
  }

  export type RunArtifactOrderByWithRelationInput = {
    id?: SortOrder
    runId?: SortOrder
    kind?: SortOrder
    targetType?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    data?: SortOrder
    previousData?: SortOrderInput | SortOrder
    appliedAt?: SortOrderInput | SortOrder
    appliedBy?: SortOrderInput | SortOrder
    rejected?: SortOrder
    rejectedReason?: SortOrderInput | SortOrder
    rejectedAt?: SortOrderInput | SortOrder
    rejectedBy?: SortOrderInput | SortOrder
    proposalOutcome?: SortOrderInput | SortOrder
    ignoredAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    run?: AgentRunOrderByWithRelationInput
  }

  export type RunArtifactWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RunArtifactWhereInput | RunArtifactWhereInput[]
    OR?: RunArtifactWhereInput[]
    NOT?: RunArtifactWhereInput | RunArtifactWhereInput[]
    runId?: StringFilter<"RunArtifact"> | string
    kind?: StringFilter<"RunArtifact"> | string
    targetType?: StringNullableFilter<"RunArtifact"> | string | null
    targetId?: StringNullableFilter<"RunArtifact"> | string | null
    data?: JsonFilter<"RunArtifact">
    previousData?: JsonNullableFilter<"RunArtifact">
    appliedAt?: DateTimeNullableFilter<"RunArtifact"> | Date | string | null
    appliedBy?: StringNullableFilter<"RunArtifact"> | string | null
    rejected?: BoolFilter<"RunArtifact"> | boolean
    rejectedReason?: StringNullableFilter<"RunArtifact"> | string | null
    rejectedAt?: DateTimeNullableFilter<"RunArtifact"> | Date | string | null
    rejectedBy?: StringNullableFilter<"RunArtifact"> | string | null
    proposalOutcome?: JsonNullableFilter<"RunArtifact">
    ignoredAt?: DateTimeNullableFilter<"RunArtifact"> | Date | string | null
    createdAt?: DateTimeFilter<"RunArtifact"> | Date | string
    run?: XOR<AgentRunScalarRelationFilter, AgentRunWhereInput>
  }, "id">

  export type RunArtifactOrderByWithAggregationInput = {
    id?: SortOrder
    runId?: SortOrder
    kind?: SortOrder
    targetType?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    data?: SortOrder
    previousData?: SortOrderInput | SortOrder
    appliedAt?: SortOrderInput | SortOrder
    appliedBy?: SortOrderInput | SortOrder
    rejected?: SortOrder
    rejectedReason?: SortOrderInput | SortOrder
    rejectedAt?: SortOrderInput | SortOrder
    rejectedBy?: SortOrderInput | SortOrder
    proposalOutcome?: SortOrderInput | SortOrder
    ignoredAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RunArtifactCountOrderByAggregateInput
    _max?: RunArtifactMaxOrderByAggregateInput
    _min?: RunArtifactMinOrderByAggregateInput
  }

  export type RunArtifactScalarWhereWithAggregatesInput = {
    AND?: RunArtifactScalarWhereWithAggregatesInput | RunArtifactScalarWhereWithAggregatesInput[]
    OR?: RunArtifactScalarWhereWithAggregatesInput[]
    NOT?: RunArtifactScalarWhereWithAggregatesInput | RunArtifactScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RunArtifact"> | string
    runId?: StringWithAggregatesFilter<"RunArtifact"> | string
    kind?: StringWithAggregatesFilter<"RunArtifact"> | string
    targetType?: StringNullableWithAggregatesFilter<"RunArtifact"> | string | null
    targetId?: StringNullableWithAggregatesFilter<"RunArtifact"> | string | null
    data?: JsonWithAggregatesFilter<"RunArtifact">
    previousData?: JsonNullableWithAggregatesFilter<"RunArtifact">
    appliedAt?: DateTimeNullableWithAggregatesFilter<"RunArtifact"> | Date | string | null
    appliedBy?: StringNullableWithAggregatesFilter<"RunArtifact"> | string | null
    rejected?: BoolWithAggregatesFilter<"RunArtifact"> | boolean
    rejectedReason?: StringNullableWithAggregatesFilter<"RunArtifact"> | string | null
    rejectedAt?: DateTimeNullableWithAggregatesFilter<"RunArtifact"> | Date | string | null
    rejectedBy?: StringNullableWithAggregatesFilter<"RunArtifact"> | string | null
    proposalOutcome?: JsonNullableWithAggregatesFilter<"RunArtifact">
    ignoredAt?: DateTimeNullableWithAggregatesFilter<"RunArtifact"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RunArtifact"> | Date | string
  }

  export type PrimitiveDefinitionWhereInput = {
    AND?: PrimitiveDefinitionWhereInput | PrimitiveDefinitionWhereInput[]
    OR?: PrimitiveDefinitionWhereInput[]
    NOT?: PrimitiveDefinitionWhereInput | PrimitiveDefinitionWhereInput[]
    id?: StringFilter<"PrimitiveDefinition"> | string
    name?: StringFilter<"PrimitiveDefinition"> | string
    slug?: StringFilter<"PrimitiveDefinition"> | string
    kind?: StringFilter<"PrimitiveDefinition"> | string
    description?: StringFilter<"PrimitiveDefinition"> | string
    instructions?: StringFilter<"PrimitiveDefinition"> | string
    config?: JsonFilter<"PrimitiveDefinition">
    allowedTools?: JsonFilter<"PrimitiveDefinition">
    defaultModel?: StringFilter<"PrimitiveDefinition"> | string
    meta?: JsonFilter<"PrimitiveDefinition">
    createdAt?: DateTimeFilter<"PrimitiveDefinition"> | Date | string
    updatedAt?: DateTimeFilter<"PrimitiveDefinition"> | Date | string
  }

  export type PrimitiveDefinitionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    kind?: SortOrder
    description?: SortOrder
    instructions?: SortOrder
    config?: SortOrder
    allowedTools?: SortOrder
    defaultModel?: SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrimitiveDefinitionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: PrimitiveDefinitionWhereInput | PrimitiveDefinitionWhereInput[]
    OR?: PrimitiveDefinitionWhereInput[]
    NOT?: PrimitiveDefinitionWhereInput | PrimitiveDefinitionWhereInput[]
    name?: StringFilter<"PrimitiveDefinition"> | string
    kind?: StringFilter<"PrimitiveDefinition"> | string
    description?: StringFilter<"PrimitiveDefinition"> | string
    instructions?: StringFilter<"PrimitiveDefinition"> | string
    config?: JsonFilter<"PrimitiveDefinition">
    allowedTools?: JsonFilter<"PrimitiveDefinition">
    defaultModel?: StringFilter<"PrimitiveDefinition"> | string
    meta?: JsonFilter<"PrimitiveDefinition">
    createdAt?: DateTimeFilter<"PrimitiveDefinition"> | Date | string
    updatedAt?: DateTimeFilter<"PrimitiveDefinition"> | Date | string
  }, "id" | "slug">

  export type PrimitiveDefinitionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    kind?: SortOrder
    description?: SortOrder
    instructions?: SortOrder
    config?: SortOrder
    allowedTools?: SortOrder
    defaultModel?: SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PrimitiveDefinitionCountOrderByAggregateInput
    _max?: PrimitiveDefinitionMaxOrderByAggregateInput
    _min?: PrimitiveDefinitionMinOrderByAggregateInput
  }

  export type PrimitiveDefinitionScalarWhereWithAggregatesInput = {
    AND?: PrimitiveDefinitionScalarWhereWithAggregatesInput | PrimitiveDefinitionScalarWhereWithAggregatesInput[]
    OR?: PrimitiveDefinitionScalarWhereWithAggregatesInput[]
    NOT?: PrimitiveDefinitionScalarWhereWithAggregatesInput | PrimitiveDefinitionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PrimitiveDefinition"> | string
    name?: StringWithAggregatesFilter<"PrimitiveDefinition"> | string
    slug?: StringWithAggregatesFilter<"PrimitiveDefinition"> | string
    kind?: StringWithAggregatesFilter<"PrimitiveDefinition"> | string
    description?: StringWithAggregatesFilter<"PrimitiveDefinition"> | string
    instructions?: StringWithAggregatesFilter<"PrimitiveDefinition"> | string
    config?: JsonWithAggregatesFilter<"PrimitiveDefinition">
    allowedTools?: JsonWithAggregatesFilter<"PrimitiveDefinition">
    defaultModel?: StringWithAggregatesFilter<"PrimitiveDefinition"> | string
    meta?: JsonWithAggregatesFilter<"PrimitiveDefinition">
    createdAt?: DateTimeWithAggregatesFilter<"PrimitiveDefinition"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PrimitiveDefinition"> | Date | string
  }

  export type RunEvalWhereInput = {
    AND?: RunEvalWhereInput | RunEvalWhereInput[]
    OR?: RunEvalWhereInput[]
    NOT?: RunEvalWhereInput | RunEvalWhereInput[]
    id?: StringFilter<"RunEval"> | string
    runId?: StringFilter<"RunEval"> | string
    evalName?: StringFilter<"RunEval"> | string
    score?: FloatNullableFilter<"RunEval"> | number | null
    pass?: BoolNullableFilter<"RunEval"> | boolean | null
    reasoning?: StringNullableFilter<"RunEval"> | string | null
    meta?: JsonFilter<"RunEval">
    createdAt?: DateTimeFilter<"RunEval"> | Date | string
    run?: XOR<AgentRunScalarRelationFilter, AgentRunWhereInput>
  }

  export type RunEvalOrderByWithRelationInput = {
    id?: SortOrder
    runId?: SortOrder
    evalName?: SortOrder
    score?: SortOrderInput | SortOrder
    pass?: SortOrderInput | SortOrder
    reasoning?: SortOrderInput | SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    run?: AgentRunOrderByWithRelationInput
  }

  export type RunEvalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RunEvalWhereInput | RunEvalWhereInput[]
    OR?: RunEvalWhereInput[]
    NOT?: RunEvalWhereInput | RunEvalWhereInput[]
    runId?: StringFilter<"RunEval"> | string
    evalName?: StringFilter<"RunEval"> | string
    score?: FloatNullableFilter<"RunEval"> | number | null
    pass?: BoolNullableFilter<"RunEval"> | boolean | null
    reasoning?: StringNullableFilter<"RunEval"> | string | null
    meta?: JsonFilter<"RunEval">
    createdAt?: DateTimeFilter<"RunEval"> | Date | string
    run?: XOR<AgentRunScalarRelationFilter, AgentRunWhereInput>
  }, "id">

  export type RunEvalOrderByWithAggregationInput = {
    id?: SortOrder
    runId?: SortOrder
    evalName?: SortOrder
    score?: SortOrderInput | SortOrder
    pass?: SortOrderInput | SortOrder
    reasoning?: SortOrderInput | SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    _count?: RunEvalCountOrderByAggregateInput
    _avg?: RunEvalAvgOrderByAggregateInput
    _max?: RunEvalMaxOrderByAggregateInput
    _min?: RunEvalMinOrderByAggregateInput
    _sum?: RunEvalSumOrderByAggregateInput
  }

  export type RunEvalScalarWhereWithAggregatesInput = {
    AND?: RunEvalScalarWhereWithAggregatesInput | RunEvalScalarWhereWithAggregatesInput[]
    OR?: RunEvalScalarWhereWithAggregatesInput[]
    NOT?: RunEvalScalarWhereWithAggregatesInput | RunEvalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RunEval"> | string
    runId?: StringWithAggregatesFilter<"RunEval"> | string
    evalName?: StringWithAggregatesFilter<"RunEval"> | string
    score?: FloatNullableWithAggregatesFilter<"RunEval"> | number | null
    pass?: BoolNullableWithAggregatesFilter<"RunEval"> | boolean | null
    reasoning?: StringNullableWithAggregatesFilter<"RunEval"> | string | null
    meta?: JsonWithAggregatesFilter<"RunEval">
    createdAt?: DateTimeWithAggregatesFilter<"RunEval"> | Date | string
  }

  export type AgentDefinitionCreateInput = {
    id: string
    name: string
    slug: string
    description?: string
    kind: string
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    publishToken?: string | null
    publishedAt?: Date | string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: AgentVersionCreateNestedManyWithoutAgentDefinitionInput
    runs?: AgentRunCreateNestedManyWithoutAgentDefinitionInput
    sessions?: ConversationSessionCreateNestedManyWithoutAgentDefinitionInput
  }

  export type AgentDefinitionUncheckedCreateInput = {
    id: string
    name: string
    slug: string
    description?: string
    kind: string
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    publishToken?: string | null
    publishedAt?: Date | string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: AgentVersionUncheckedCreateNestedManyWithoutAgentDefinitionInput
    runs?: AgentRunUncheckedCreateNestedManyWithoutAgentDefinitionInput
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutAgentDefinitionInput
  }

  export type AgentDefinitionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    publishToken?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: AgentVersionUpdateManyWithoutAgentDefinitionNestedInput
    runs?: AgentRunUpdateManyWithoutAgentDefinitionNestedInput
    sessions?: ConversationSessionUpdateManyWithoutAgentDefinitionNestedInput
  }

  export type AgentDefinitionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    publishToken?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: AgentVersionUncheckedUpdateManyWithoutAgentDefinitionNestedInput
    runs?: AgentRunUncheckedUpdateManyWithoutAgentDefinitionNestedInput
    sessions?: ConversationSessionUncheckedUpdateManyWithoutAgentDefinitionNestedInput
  }

  export type AgentDefinitionCreateManyInput = {
    id: string
    name: string
    slug: string
    description?: string
    kind: string
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    publishToken?: string | null
    publishedAt?: Date | string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentDefinitionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    publishToken?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentDefinitionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    publishToken?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentVersionCreateInput = {
    id: string
    version: number
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog: string
    createdAt?: Date | string
    agentDefinition: AgentDefinitionCreateNestedOneWithoutVersionsInput
  }

  export type AgentVersionUncheckedCreateInput = {
    id: string
    agentDefinitionId: string
    version: number
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog: string
    createdAt?: Date | string
  }

  export type AgentVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentDefinition?: AgentDefinitionUpdateOneRequiredWithoutVersionsNestedInput
  }

  export type AgentVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentDefinitionId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentVersionCreateManyInput = {
    id: string
    agentDefinitionId: string
    version: number
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog: string
    createdAt?: Date | string
  }

  export type AgentVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentDefinitionId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentRunCreateInput = {
    id: string
    agentVersionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    agentDefinition: AgentDefinitionCreateNestedOneWithoutRunsInput
    session?: ConversationSessionCreateNestedOneWithoutRunsInput
    steps?: RunStepCreateNestedManyWithoutRunInput
    artifacts?: RunArtifactCreateNestedManyWithoutRunInput
    evals?: RunEvalCreateNestedManyWithoutRunInput
  }

  export type AgentRunUncheckedCreateInput = {
    id: string
    agentDefinitionId: string
    agentVersionId?: string | null
    sessionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    steps?: RunStepUncheckedCreateNestedManyWithoutRunInput
    artifacts?: RunArtifactUncheckedCreateNestedManyWithoutRunInput
    evals?: RunEvalUncheckedCreateNestedManyWithoutRunInput
  }

  export type AgentRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentDefinition?: AgentDefinitionUpdateOneRequiredWithoutRunsNestedInput
    session?: ConversationSessionUpdateOneWithoutRunsNestedInput
    steps?: RunStepUpdateManyWithoutRunNestedInput
    artifacts?: RunArtifactUpdateManyWithoutRunNestedInput
    evals?: RunEvalUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentDefinitionId?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    steps?: RunStepUncheckedUpdateManyWithoutRunNestedInput
    artifacts?: RunArtifactUncheckedUpdateManyWithoutRunNestedInput
    evals?: RunEvalUncheckedUpdateManyWithoutRunNestedInput
  }

  export type AgentRunCreateManyInput = {
    id: string
    agentDefinitionId: string
    agentVersionId?: string | null
    sessionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentDefinitionId?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationSessionCreateInput = {
    id: string
    status?: string
    participantId?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    agentDefinition: AgentDefinitionCreateNestedOneWithoutSessionsInput
    runs?: AgentRunCreateNestedManyWithoutSessionInput
  }

  export type ConversationSessionUncheckedCreateInput = {
    id: string
    agentDefinitionId: string
    status?: string
    participantId?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    runs?: AgentRunUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ConversationSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentDefinition?: AgentDefinitionUpdateOneRequiredWithoutSessionsNestedInput
    runs?: AgentRunUpdateManyWithoutSessionNestedInput
  }

  export type ConversationSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentDefinitionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    runs?: AgentRunUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ConversationSessionCreateManyInput = {
    id: string
    agentDefinitionId: string
    status?: string
    participantId?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentDefinitionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunStepCreateInput = {
    id: string
    stepIndex: number
    kind: string
    status: string
    toolName?: string | null
    nodeId?: string | null
    input: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: number | null
    error?: string | null
    validationPassed?: boolean | null
    createdAt?: Date | string
    run: AgentRunCreateNestedOneWithoutStepsInput
  }

  export type RunStepUncheckedCreateInput = {
    id: string
    runId: string
    stepIndex: number
    kind: string
    status: string
    toolName?: string | null
    nodeId?: string | null
    input: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: number | null
    error?: string | null
    validationPassed?: boolean | null
    createdAt?: Date | string
  }

  export type RunStepUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stepIndex?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    validationPassed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    run?: AgentRunUpdateOneRequiredWithoutStepsNestedInput
  }

  export type RunStepUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    runId?: StringFieldUpdateOperationsInput | string
    stepIndex?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    validationPassed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunStepCreateManyInput = {
    id: string
    runId: string
    stepIndex: number
    kind: string
    status: string
    toolName?: string | null
    nodeId?: string | null
    input: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: number | null
    error?: string | null
    validationPassed?: boolean | null
    createdAt?: Date | string
  }

  export type RunStepUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stepIndex?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    validationPassed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunStepUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    runId?: StringFieldUpdateOperationsInput | string
    stepIndex?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    validationPassed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunArtifactCreateInput = {
    id: string
    kind: string
    targetType?: string | null
    targetId?: string | null
    data: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: Date | string | null
    appliedBy?: string | null
    rejected?: boolean
    rejectedReason?: string | null
    rejectedAt?: Date | string | null
    rejectedBy?: string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: Date | string | null
    createdAt?: Date | string
    run: AgentRunCreateNestedOneWithoutArtifactsInput
  }

  export type RunArtifactUncheckedCreateInput = {
    id: string
    runId: string
    kind: string
    targetType?: string | null
    targetId?: string | null
    data: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: Date | string | null
    appliedBy?: string | null
    rejected?: boolean
    rejectedReason?: string | null
    rejectedAt?: Date | string | null
    rejectedBy?: string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RunArtifactUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appliedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejected?: BoolFieldUpdateOperationsInput | boolean
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedBy?: NullableStringFieldUpdateOperationsInput | string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    run?: AgentRunUpdateOneRequiredWithoutArtifactsNestedInput
  }

  export type RunArtifactUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    runId?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appliedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejected?: BoolFieldUpdateOperationsInput | boolean
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedBy?: NullableStringFieldUpdateOperationsInput | string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunArtifactCreateManyInput = {
    id: string
    runId: string
    kind: string
    targetType?: string | null
    targetId?: string | null
    data: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: Date | string | null
    appliedBy?: string | null
    rejected?: boolean
    rejectedReason?: string | null
    rejectedAt?: Date | string | null
    rejectedBy?: string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RunArtifactUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appliedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejected?: BoolFieldUpdateOperationsInput | boolean
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedBy?: NullableStringFieldUpdateOperationsInput | string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunArtifactUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    runId?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appliedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejected?: BoolFieldUpdateOperationsInput | boolean
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedBy?: NullableStringFieldUpdateOperationsInput | string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrimitiveDefinitionCreateInput = {
    id: string
    name: string
    slug: string
    kind: string
    description?: string
    instructions: string
    config: JsonNullValueInput | InputJsonValue
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PrimitiveDefinitionUncheckedCreateInput = {
    id: string
    name: string
    slug: string
    kind: string
    description?: string
    instructions: string
    config: JsonNullValueInput | InputJsonValue
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PrimitiveDefinitionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrimitiveDefinitionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrimitiveDefinitionCreateManyInput = {
    id: string
    name: string
    slug: string
    kind: string
    description?: string
    instructions: string
    config: JsonNullValueInput | InputJsonValue
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PrimitiveDefinitionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrimitiveDefinitionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunEvalCreateInput = {
    id: string
    evalName: string
    score?: number | null
    pass?: boolean | null
    reasoning?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    run: AgentRunCreateNestedOneWithoutEvalsInput
  }

  export type RunEvalUncheckedCreateInput = {
    id: string
    runId: string
    evalName: string
    score?: number | null
    pass?: boolean | null
    reasoning?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RunEvalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    evalName?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    pass?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    run?: AgentRunUpdateOneRequiredWithoutEvalsNestedInput
  }

  export type RunEvalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    runId?: StringFieldUpdateOperationsInput | string
    evalName?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    pass?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunEvalCreateManyInput = {
    id: string
    runId: string
    evalName: string
    score?: number | null
    pass?: boolean | null
    reasoning?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RunEvalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    evalName?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    pass?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunEvalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    runId?: StringFieldUpdateOperationsInput | string
    evalName?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    pass?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AgentVersionListRelationFilter = {
    every?: AgentVersionWhereInput
    some?: AgentVersionWhereInput
    none?: AgentVersionWhereInput
  }

  export type AgentRunListRelationFilter = {
    every?: AgentRunWhereInput
    some?: AgentRunWhereInput
    none?: AgentRunWhereInput
  }

  export type ConversationSessionListRelationFilter = {
    every?: ConversationSessionWhereInput
    some?: ConversationSessionWhereInput
    none?: ConversationSessionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AgentVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AgentRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConversationSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AgentDefinitionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    kind?: SortOrder
    instructions?: SortOrder
    allowedTools?: SortOrder
    defaultModel?: SortOrder
    outputSchema?: SortOrder
    flowDefinition?: SortOrder
    mode?: SortOrder
    publishToken?: SortOrder
    publishedAt?: SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentDefinitionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    kind?: SortOrder
    instructions?: SortOrder
    defaultModel?: SortOrder
    mode?: SortOrder
    publishToken?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentDefinitionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    kind?: SortOrder
    instructions?: SortOrder
    defaultModel?: SortOrder
    mode?: SortOrder
    publishToken?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type AgentDefinitionScalarRelationFilter = {
    is?: AgentDefinitionWhereInput
    isNot?: AgentDefinitionWhereInput
  }

  export type AgentVersionAgentDefinitionIdVersionCompoundUniqueInput = {
    agentDefinitionId: string
    version: number
  }

  export type AgentVersionCountOrderByAggregateInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    version?: SortOrder
    instructions?: SortOrder
    allowedTools?: SortOrder
    defaultModel?: SortOrder
    outputSchema?: SortOrder
    flowDefinition?: SortOrder
    changelog?: SortOrder
    createdAt?: SortOrder
  }

  export type AgentVersionAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type AgentVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    version?: SortOrder
    instructions?: SortOrder
    defaultModel?: SortOrder
    changelog?: SortOrder
    createdAt?: SortOrder
  }

  export type AgentVersionMinOrderByAggregateInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    version?: SortOrder
    instructions?: SortOrder
    defaultModel?: SortOrder
    changelog?: SortOrder
    createdAt?: SortOrder
  }

  export type AgentVersionSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ConversationSessionNullableScalarRelationFilter = {
    is?: ConversationSessionWhereInput | null
    isNot?: ConversationSessionWhereInput | null
  }

  export type RunStepListRelationFilter = {
    every?: RunStepWhereInput
    some?: RunStepWhereInput
    none?: RunStepWhereInput
  }

  export type RunArtifactListRelationFilter = {
    every?: RunArtifactWhereInput
    some?: RunArtifactWhereInput
    none?: RunArtifactWhereInput
  }

  export type RunEvalListRelationFilter = {
    every?: RunEvalWhereInput
    some?: RunEvalWhereInput
    none?: RunEvalWhereInput
  }

  export type RunStepOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RunArtifactOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RunEvalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AgentRunCountOrderByAggregateInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    agentVersionId?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    input?: SortOrder
    finalOutput?: SortOrder
    tokenUsage?: SortOrder
    costEstimate?: SortOrder
    durationMs?: SortOrder
    error?: SortOrder
    triggeredBy?: SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentRunAvgOrderByAggregateInput = {
    costEstimate?: SortOrder
    durationMs?: SortOrder
  }

  export type AgentRunMaxOrderByAggregateInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    agentVersionId?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    input?: SortOrder
    finalOutput?: SortOrder
    costEstimate?: SortOrder
    durationMs?: SortOrder
    error?: SortOrder
    triggeredBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentRunMinOrderByAggregateInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    agentVersionId?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    input?: SortOrder
    finalOutput?: SortOrder
    costEstimate?: SortOrder
    durationMs?: SortOrder
    error?: SortOrder
    triggeredBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentRunSumOrderByAggregateInput = {
    costEstimate?: SortOrder
    durationMs?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type ConversationSessionCountOrderByAggregateInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    status?: SortOrder
    participantId?: SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversationSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    status?: SortOrder
    participantId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversationSessionMinOrderByAggregateInput = {
    id?: SortOrder
    agentDefinitionId?: SortOrder
    status?: SortOrder
    participantId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type AgentRunScalarRelationFilter = {
    is?: AgentRunWhereInput
    isNot?: AgentRunWhereInput
  }

  export type RunStepCountOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    stepIndex?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    toolName?: SortOrder
    nodeId?: SortOrder
    input?: SortOrder
    output?: SortOrder
    tokenUsage?: SortOrder
    durationMs?: SortOrder
    error?: SortOrder
    validationPassed?: SortOrder
    createdAt?: SortOrder
  }

  export type RunStepAvgOrderByAggregateInput = {
    stepIndex?: SortOrder
    durationMs?: SortOrder
  }

  export type RunStepMaxOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    stepIndex?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    toolName?: SortOrder
    nodeId?: SortOrder
    durationMs?: SortOrder
    error?: SortOrder
    validationPassed?: SortOrder
    createdAt?: SortOrder
  }

  export type RunStepMinOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    stepIndex?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    toolName?: SortOrder
    nodeId?: SortOrder
    durationMs?: SortOrder
    error?: SortOrder
    validationPassed?: SortOrder
    createdAt?: SortOrder
  }

  export type RunStepSumOrderByAggregateInput = {
    stepIndex?: SortOrder
    durationMs?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type RunArtifactCountOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    kind?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    data?: SortOrder
    previousData?: SortOrder
    appliedAt?: SortOrder
    appliedBy?: SortOrder
    rejected?: SortOrder
    rejectedReason?: SortOrder
    rejectedAt?: SortOrder
    rejectedBy?: SortOrder
    proposalOutcome?: SortOrder
    ignoredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RunArtifactMaxOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    kind?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    appliedAt?: SortOrder
    appliedBy?: SortOrder
    rejected?: SortOrder
    rejectedReason?: SortOrder
    rejectedAt?: SortOrder
    rejectedBy?: SortOrder
    ignoredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RunArtifactMinOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    kind?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    appliedAt?: SortOrder
    appliedBy?: SortOrder
    rejected?: SortOrder
    rejectedReason?: SortOrder
    rejectedAt?: SortOrder
    rejectedBy?: SortOrder
    ignoredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type PrimitiveDefinitionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    kind?: SortOrder
    description?: SortOrder
    instructions?: SortOrder
    config?: SortOrder
    allowedTools?: SortOrder
    defaultModel?: SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrimitiveDefinitionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    kind?: SortOrder
    description?: SortOrder
    instructions?: SortOrder
    defaultModel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrimitiveDefinitionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    kind?: SortOrder
    description?: SortOrder
    instructions?: SortOrder
    defaultModel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RunEvalCountOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    evalName?: SortOrder
    score?: SortOrder
    pass?: SortOrder
    reasoning?: SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
  }

  export type RunEvalAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type RunEvalMaxOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    evalName?: SortOrder
    score?: SortOrder
    pass?: SortOrder
    reasoning?: SortOrder
    createdAt?: SortOrder
  }

  export type RunEvalMinOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    evalName?: SortOrder
    score?: SortOrder
    pass?: SortOrder
    reasoning?: SortOrder
    createdAt?: SortOrder
  }

  export type RunEvalSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type AgentVersionCreateNestedManyWithoutAgentDefinitionInput = {
    create?: XOR<AgentVersionCreateWithoutAgentDefinitionInput, AgentVersionUncheckedCreateWithoutAgentDefinitionInput> | AgentVersionCreateWithoutAgentDefinitionInput[] | AgentVersionUncheckedCreateWithoutAgentDefinitionInput[]
    connectOrCreate?: AgentVersionCreateOrConnectWithoutAgentDefinitionInput | AgentVersionCreateOrConnectWithoutAgentDefinitionInput[]
    createMany?: AgentVersionCreateManyAgentDefinitionInputEnvelope
    connect?: AgentVersionWhereUniqueInput | AgentVersionWhereUniqueInput[]
  }

  export type AgentRunCreateNestedManyWithoutAgentDefinitionInput = {
    create?: XOR<AgentRunCreateWithoutAgentDefinitionInput, AgentRunUncheckedCreateWithoutAgentDefinitionInput> | AgentRunCreateWithoutAgentDefinitionInput[] | AgentRunUncheckedCreateWithoutAgentDefinitionInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutAgentDefinitionInput | AgentRunCreateOrConnectWithoutAgentDefinitionInput[]
    createMany?: AgentRunCreateManyAgentDefinitionInputEnvelope
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
  }

  export type ConversationSessionCreateNestedManyWithoutAgentDefinitionInput = {
    create?: XOR<ConversationSessionCreateWithoutAgentDefinitionInput, ConversationSessionUncheckedCreateWithoutAgentDefinitionInput> | ConversationSessionCreateWithoutAgentDefinitionInput[] | ConversationSessionUncheckedCreateWithoutAgentDefinitionInput[]
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutAgentDefinitionInput | ConversationSessionCreateOrConnectWithoutAgentDefinitionInput[]
    createMany?: ConversationSessionCreateManyAgentDefinitionInputEnvelope
    connect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
  }

  export type AgentVersionUncheckedCreateNestedManyWithoutAgentDefinitionInput = {
    create?: XOR<AgentVersionCreateWithoutAgentDefinitionInput, AgentVersionUncheckedCreateWithoutAgentDefinitionInput> | AgentVersionCreateWithoutAgentDefinitionInput[] | AgentVersionUncheckedCreateWithoutAgentDefinitionInput[]
    connectOrCreate?: AgentVersionCreateOrConnectWithoutAgentDefinitionInput | AgentVersionCreateOrConnectWithoutAgentDefinitionInput[]
    createMany?: AgentVersionCreateManyAgentDefinitionInputEnvelope
    connect?: AgentVersionWhereUniqueInput | AgentVersionWhereUniqueInput[]
  }

  export type AgentRunUncheckedCreateNestedManyWithoutAgentDefinitionInput = {
    create?: XOR<AgentRunCreateWithoutAgentDefinitionInput, AgentRunUncheckedCreateWithoutAgentDefinitionInput> | AgentRunCreateWithoutAgentDefinitionInput[] | AgentRunUncheckedCreateWithoutAgentDefinitionInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutAgentDefinitionInput | AgentRunCreateOrConnectWithoutAgentDefinitionInput[]
    createMany?: AgentRunCreateManyAgentDefinitionInputEnvelope
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
  }

  export type ConversationSessionUncheckedCreateNestedManyWithoutAgentDefinitionInput = {
    create?: XOR<ConversationSessionCreateWithoutAgentDefinitionInput, ConversationSessionUncheckedCreateWithoutAgentDefinitionInput> | ConversationSessionCreateWithoutAgentDefinitionInput[] | ConversationSessionUncheckedCreateWithoutAgentDefinitionInput[]
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutAgentDefinitionInput | ConversationSessionCreateOrConnectWithoutAgentDefinitionInput[]
    createMany?: ConversationSessionCreateManyAgentDefinitionInputEnvelope
    connect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AgentVersionUpdateManyWithoutAgentDefinitionNestedInput = {
    create?: XOR<AgentVersionCreateWithoutAgentDefinitionInput, AgentVersionUncheckedCreateWithoutAgentDefinitionInput> | AgentVersionCreateWithoutAgentDefinitionInput[] | AgentVersionUncheckedCreateWithoutAgentDefinitionInput[]
    connectOrCreate?: AgentVersionCreateOrConnectWithoutAgentDefinitionInput | AgentVersionCreateOrConnectWithoutAgentDefinitionInput[]
    upsert?: AgentVersionUpsertWithWhereUniqueWithoutAgentDefinitionInput | AgentVersionUpsertWithWhereUniqueWithoutAgentDefinitionInput[]
    createMany?: AgentVersionCreateManyAgentDefinitionInputEnvelope
    set?: AgentVersionWhereUniqueInput | AgentVersionWhereUniqueInput[]
    disconnect?: AgentVersionWhereUniqueInput | AgentVersionWhereUniqueInput[]
    delete?: AgentVersionWhereUniqueInput | AgentVersionWhereUniqueInput[]
    connect?: AgentVersionWhereUniqueInput | AgentVersionWhereUniqueInput[]
    update?: AgentVersionUpdateWithWhereUniqueWithoutAgentDefinitionInput | AgentVersionUpdateWithWhereUniqueWithoutAgentDefinitionInput[]
    updateMany?: AgentVersionUpdateManyWithWhereWithoutAgentDefinitionInput | AgentVersionUpdateManyWithWhereWithoutAgentDefinitionInput[]
    deleteMany?: AgentVersionScalarWhereInput | AgentVersionScalarWhereInput[]
  }

  export type AgentRunUpdateManyWithoutAgentDefinitionNestedInput = {
    create?: XOR<AgentRunCreateWithoutAgentDefinitionInput, AgentRunUncheckedCreateWithoutAgentDefinitionInput> | AgentRunCreateWithoutAgentDefinitionInput[] | AgentRunUncheckedCreateWithoutAgentDefinitionInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutAgentDefinitionInput | AgentRunCreateOrConnectWithoutAgentDefinitionInput[]
    upsert?: AgentRunUpsertWithWhereUniqueWithoutAgentDefinitionInput | AgentRunUpsertWithWhereUniqueWithoutAgentDefinitionInput[]
    createMany?: AgentRunCreateManyAgentDefinitionInputEnvelope
    set?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    disconnect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    delete?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    update?: AgentRunUpdateWithWhereUniqueWithoutAgentDefinitionInput | AgentRunUpdateWithWhereUniqueWithoutAgentDefinitionInput[]
    updateMany?: AgentRunUpdateManyWithWhereWithoutAgentDefinitionInput | AgentRunUpdateManyWithWhereWithoutAgentDefinitionInput[]
    deleteMany?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
  }

  export type ConversationSessionUpdateManyWithoutAgentDefinitionNestedInput = {
    create?: XOR<ConversationSessionCreateWithoutAgentDefinitionInput, ConversationSessionUncheckedCreateWithoutAgentDefinitionInput> | ConversationSessionCreateWithoutAgentDefinitionInput[] | ConversationSessionUncheckedCreateWithoutAgentDefinitionInput[]
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutAgentDefinitionInput | ConversationSessionCreateOrConnectWithoutAgentDefinitionInput[]
    upsert?: ConversationSessionUpsertWithWhereUniqueWithoutAgentDefinitionInput | ConversationSessionUpsertWithWhereUniqueWithoutAgentDefinitionInput[]
    createMany?: ConversationSessionCreateManyAgentDefinitionInputEnvelope
    set?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    disconnect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    delete?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    connect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    update?: ConversationSessionUpdateWithWhereUniqueWithoutAgentDefinitionInput | ConversationSessionUpdateWithWhereUniqueWithoutAgentDefinitionInput[]
    updateMany?: ConversationSessionUpdateManyWithWhereWithoutAgentDefinitionInput | ConversationSessionUpdateManyWithWhereWithoutAgentDefinitionInput[]
    deleteMany?: ConversationSessionScalarWhereInput | ConversationSessionScalarWhereInput[]
  }

  export type AgentVersionUncheckedUpdateManyWithoutAgentDefinitionNestedInput = {
    create?: XOR<AgentVersionCreateWithoutAgentDefinitionInput, AgentVersionUncheckedCreateWithoutAgentDefinitionInput> | AgentVersionCreateWithoutAgentDefinitionInput[] | AgentVersionUncheckedCreateWithoutAgentDefinitionInput[]
    connectOrCreate?: AgentVersionCreateOrConnectWithoutAgentDefinitionInput | AgentVersionCreateOrConnectWithoutAgentDefinitionInput[]
    upsert?: AgentVersionUpsertWithWhereUniqueWithoutAgentDefinitionInput | AgentVersionUpsertWithWhereUniqueWithoutAgentDefinitionInput[]
    createMany?: AgentVersionCreateManyAgentDefinitionInputEnvelope
    set?: AgentVersionWhereUniqueInput | AgentVersionWhereUniqueInput[]
    disconnect?: AgentVersionWhereUniqueInput | AgentVersionWhereUniqueInput[]
    delete?: AgentVersionWhereUniqueInput | AgentVersionWhereUniqueInput[]
    connect?: AgentVersionWhereUniqueInput | AgentVersionWhereUniqueInput[]
    update?: AgentVersionUpdateWithWhereUniqueWithoutAgentDefinitionInput | AgentVersionUpdateWithWhereUniqueWithoutAgentDefinitionInput[]
    updateMany?: AgentVersionUpdateManyWithWhereWithoutAgentDefinitionInput | AgentVersionUpdateManyWithWhereWithoutAgentDefinitionInput[]
    deleteMany?: AgentVersionScalarWhereInput | AgentVersionScalarWhereInput[]
  }

  export type AgentRunUncheckedUpdateManyWithoutAgentDefinitionNestedInput = {
    create?: XOR<AgentRunCreateWithoutAgentDefinitionInput, AgentRunUncheckedCreateWithoutAgentDefinitionInput> | AgentRunCreateWithoutAgentDefinitionInput[] | AgentRunUncheckedCreateWithoutAgentDefinitionInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutAgentDefinitionInput | AgentRunCreateOrConnectWithoutAgentDefinitionInput[]
    upsert?: AgentRunUpsertWithWhereUniqueWithoutAgentDefinitionInput | AgentRunUpsertWithWhereUniqueWithoutAgentDefinitionInput[]
    createMany?: AgentRunCreateManyAgentDefinitionInputEnvelope
    set?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    disconnect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    delete?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    update?: AgentRunUpdateWithWhereUniqueWithoutAgentDefinitionInput | AgentRunUpdateWithWhereUniqueWithoutAgentDefinitionInput[]
    updateMany?: AgentRunUpdateManyWithWhereWithoutAgentDefinitionInput | AgentRunUpdateManyWithWhereWithoutAgentDefinitionInput[]
    deleteMany?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
  }

  export type ConversationSessionUncheckedUpdateManyWithoutAgentDefinitionNestedInput = {
    create?: XOR<ConversationSessionCreateWithoutAgentDefinitionInput, ConversationSessionUncheckedCreateWithoutAgentDefinitionInput> | ConversationSessionCreateWithoutAgentDefinitionInput[] | ConversationSessionUncheckedCreateWithoutAgentDefinitionInput[]
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutAgentDefinitionInput | ConversationSessionCreateOrConnectWithoutAgentDefinitionInput[]
    upsert?: ConversationSessionUpsertWithWhereUniqueWithoutAgentDefinitionInput | ConversationSessionUpsertWithWhereUniqueWithoutAgentDefinitionInput[]
    createMany?: ConversationSessionCreateManyAgentDefinitionInputEnvelope
    set?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    disconnect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    delete?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    connect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    update?: ConversationSessionUpdateWithWhereUniqueWithoutAgentDefinitionInput | ConversationSessionUpdateWithWhereUniqueWithoutAgentDefinitionInput[]
    updateMany?: ConversationSessionUpdateManyWithWhereWithoutAgentDefinitionInput | ConversationSessionUpdateManyWithWhereWithoutAgentDefinitionInput[]
    deleteMany?: ConversationSessionScalarWhereInput | ConversationSessionScalarWhereInput[]
  }

  export type AgentDefinitionCreateNestedOneWithoutVersionsInput = {
    create?: XOR<AgentDefinitionCreateWithoutVersionsInput, AgentDefinitionUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: AgentDefinitionCreateOrConnectWithoutVersionsInput
    connect?: AgentDefinitionWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AgentDefinitionUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: XOR<AgentDefinitionCreateWithoutVersionsInput, AgentDefinitionUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: AgentDefinitionCreateOrConnectWithoutVersionsInput
    upsert?: AgentDefinitionUpsertWithoutVersionsInput
    connect?: AgentDefinitionWhereUniqueInput
    update?: XOR<XOR<AgentDefinitionUpdateToOneWithWhereWithoutVersionsInput, AgentDefinitionUpdateWithoutVersionsInput>, AgentDefinitionUncheckedUpdateWithoutVersionsInput>
  }

  export type AgentDefinitionCreateNestedOneWithoutRunsInput = {
    create?: XOR<AgentDefinitionCreateWithoutRunsInput, AgentDefinitionUncheckedCreateWithoutRunsInput>
    connectOrCreate?: AgentDefinitionCreateOrConnectWithoutRunsInput
    connect?: AgentDefinitionWhereUniqueInput
  }

  export type ConversationSessionCreateNestedOneWithoutRunsInput = {
    create?: XOR<ConversationSessionCreateWithoutRunsInput, ConversationSessionUncheckedCreateWithoutRunsInput>
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutRunsInput
    connect?: ConversationSessionWhereUniqueInput
  }

  export type RunStepCreateNestedManyWithoutRunInput = {
    create?: XOR<RunStepCreateWithoutRunInput, RunStepUncheckedCreateWithoutRunInput> | RunStepCreateWithoutRunInput[] | RunStepUncheckedCreateWithoutRunInput[]
    connectOrCreate?: RunStepCreateOrConnectWithoutRunInput | RunStepCreateOrConnectWithoutRunInput[]
    createMany?: RunStepCreateManyRunInputEnvelope
    connect?: RunStepWhereUniqueInput | RunStepWhereUniqueInput[]
  }

  export type RunArtifactCreateNestedManyWithoutRunInput = {
    create?: XOR<RunArtifactCreateWithoutRunInput, RunArtifactUncheckedCreateWithoutRunInput> | RunArtifactCreateWithoutRunInput[] | RunArtifactUncheckedCreateWithoutRunInput[]
    connectOrCreate?: RunArtifactCreateOrConnectWithoutRunInput | RunArtifactCreateOrConnectWithoutRunInput[]
    createMany?: RunArtifactCreateManyRunInputEnvelope
    connect?: RunArtifactWhereUniqueInput | RunArtifactWhereUniqueInput[]
  }

  export type RunEvalCreateNestedManyWithoutRunInput = {
    create?: XOR<RunEvalCreateWithoutRunInput, RunEvalUncheckedCreateWithoutRunInput> | RunEvalCreateWithoutRunInput[] | RunEvalUncheckedCreateWithoutRunInput[]
    connectOrCreate?: RunEvalCreateOrConnectWithoutRunInput | RunEvalCreateOrConnectWithoutRunInput[]
    createMany?: RunEvalCreateManyRunInputEnvelope
    connect?: RunEvalWhereUniqueInput | RunEvalWhereUniqueInput[]
  }

  export type RunStepUncheckedCreateNestedManyWithoutRunInput = {
    create?: XOR<RunStepCreateWithoutRunInput, RunStepUncheckedCreateWithoutRunInput> | RunStepCreateWithoutRunInput[] | RunStepUncheckedCreateWithoutRunInput[]
    connectOrCreate?: RunStepCreateOrConnectWithoutRunInput | RunStepCreateOrConnectWithoutRunInput[]
    createMany?: RunStepCreateManyRunInputEnvelope
    connect?: RunStepWhereUniqueInput | RunStepWhereUniqueInput[]
  }

  export type RunArtifactUncheckedCreateNestedManyWithoutRunInput = {
    create?: XOR<RunArtifactCreateWithoutRunInput, RunArtifactUncheckedCreateWithoutRunInput> | RunArtifactCreateWithoutRunInput[] | RunArtifactUncheckedCreateWithoutRunInput[]
    connectOrCreate?: RunArtifactCreateOrConnectWithoutRunInput | RunArtifactCreateOrConnectWithoutRunInput[]
    createMany?: RunArtifactCreateManyRunInputEnvelope
    connect?: RunArtifactWhereUniqueInput | RunArtifactWhereUniqueInput[]
  }

  export type RunEvalUncheckedCreateNestedManyWithoutRunInput = {
    create?: XOR<RunEvalCreateWithoutRunInput, RunEvalUncheckedCreateWithoutRunInput> | RunEvalCreateWithoutRunInput[] | RunEvalUncheckedCreateWithoutRunInput[]
    connectOrCreate?: RunEvalCreateOrConnectWithoutRunInput | RunEvalCreateOrConnectWithoutRunInput[]
    createMany?: RunEvalCreateManyRunInputEnvelope
    connect?: RunEvalWhereUniqueInput | RunEvalWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AgentDefinitionUpdateOneRequiredWithoutRunsNestedInput = {
    create?: XOR<AgentDefinitionCreateWithoutRunsInput, AgentDefinitionUncheckedCreateWithoutRunsInput>
    connectOrCreate?: AgentDefinitionCreateOrConnectWithoutRunsInput
    upsert?: AgentDefinitionUpsertWithoutRunsInput
    connect?: AgentDefinitionWhereUniqueInput
    update?: XOR<XOR<AgentDefinitionUpdateToOneWithWhereWithoutRunsInput, AgentDefinitionUpdateWithoutRunsInput>, AgentDefinitionUncheckedUpdateWithoutRunsInput>
  }

  export type ConversationSessionUpdateOneWithoutRunsNestedInput = {
    create?: XOR<ConversationSessionCreateWithoutRunsInput, ConversationSessionUncheckedCreateWithoutRunsInput>
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutRunsInput
    upsert?: ConversationSessionUpsertWithoutRunsInput
    disconnect?: ConversationSessionWhereInput | boolean
    delete?: ConversationSessionWhereInput | boolean
    connect?: ConversationSessionWhereUniqueInput
    update?: XOR<XOR<ConversationSessionUpdateToOneWithWhereWithoutRunsInput, ConversationSessionUpdateWithoutRunsInput>, ConversationSessionUncheckedUpdateWithoutRunsInput>
  }

  export type RunStepUpdateManyWithoutRunNestedInput = {
    create?: XOR<RunStepCreateWithoutRunInput, RunStepUncheckedCreateWithoutRunInput> | RunStepCreateWithoutRunInput[] | RunStepUncheckedCreateWithoutRunInput[]
    connectOrCreate?: RunStepCreateOrConnectWithoutRunInput | RunStepCreateOrConnectWithoutRunInput[]
    upsert?: RunStepUpsertWithWhereUniqueWithoutRunInput | RunStepUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: RunStepCreateManyRunInputEnvelope
    set?: RunStepWhereUniqueInput | RunStepWhereUniqueInput[]
    disconnect?: RunStepWhereUniqueInput | RunStepWhereUniqueInput[]
    delete?: RunStepWhereUniqueInput | RunStepWhereUniqueInput[]
    connect?: RunStepWhereUniqueInput | RunStepWhereUniqueInput[]
    update?: RunStepUpdateWithWhereUniqueWithoutRunInput | RunStepUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?: RunStepUpdateManyWithWhereWithoutRunInput | RunStepUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: RunStepScalarWhereInput | RunStepScalarWhereInput[]
  }

  export type RunArtifactUpdateManyWithoutRunNestedInput = {
    create?: XOR<RunArtifactCreateWithoutRunInput, RunArtifactUncheckedCreateWithoutRunInput> | RunArtifactCreateWithoutRunInput[] | RunArtifactUncheckedCreateWithoutRunInput[]
    connectOrCreate?: RunArtifactCreateOrConnectWithoutRunInput | RunArtifactCreateOrConnectWithoutRunInput[]
    upsert?: RunArtifactUpsertWithWhereUniqueWithoutRunInput | RunArtifactUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: RunArtifactCreateManyRunInputEnvelope
    set?: RunArtifactWhereUniqueInput | RunArtifactWhereUniqueInput[]
    disconnect?: RunArtifactWhereUniqueInput | RunArtifactWhereUniqueInput[]
    delete?: RunArtifactWhereUniqueInput | RunArtifactWhereUniqueInput[]
    connect?: RunArtifactWhereUniqueInput | RunArtifactWhereUniqueInput[]
    update?: RunArtifactUpdateWithWhereUniqueWithoutRunInput | RunArtifactUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?: RunArtifactUpdateManyWithWhereWithoutRunInput | RunArtifactUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: RunArtifactScalarWhereInput | RunArtifactScalarWhereInput[]
  }

  export type RunEvalUpdateManyWithoutRunNestedInput = {
    create?: XOR<RunEvalCreateWithoutRunInput, RunEvalUncheckedCreateWithoutRunInput> | RunEvalCreateWithoutRunInput[] | RunEvalUncheckedCreateWithoutRunInput[]
    connectOrCreate?: RunEvalCreateOrConnectWithoutRunInput | RunEvalCreateOrConnectWithoutRunInput[]
    upsert?: RunEvalUpsertWithWhereUniqueWithoutRunInput | RunEvalUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: RunEvalCreateManyRunInputEnvelope
    set?: RunEvalWhereUniqueInput | RunEvalWhereUniqueInput[]
    disconnect?: RunEvalWhereUniqueInput | RunEvalWhereUniqueInput[]
    delete?: RunEvalWhereUniqueInput | RunEvalWhereUniqueInput[]
    connect?: RunEvalWhereUniqueInput | RunEvalWhereUniqueInput[]
    update?: RunEvalUpdateWithWhereUniqueWithoutRunInput | RunEvalUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?: RunEvalUpdateManyWithWhereWithoutRunInput | RunEvalUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: RunEvalScalarWhereInput | RunEvalScalarWhereInput[]
  }

  export type RunStepUncheckedUpdateManyWithoutRunNestedInput = {
    create?: XOR<RunStepCreateWithoutRunInput, RunStepUncheckedCreateWithoutRunInput> | RunStepCreateWithoutRunInput[] | RunStepUncheckedCreateWithoutRunInput[]
    connectOrCreate?: RunStepCreateOrConnectWithoutRunInput | RunStepCreateOrConnectWithoutRunInput[]
    upsert?: RunStepUpsertWithWhereUniqueWithoutRunInput | RunStepUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: RunStepCreateManyRunInputEnvelope
    set?: RunStepWhereUniqueInput | RunStepWhereUniqueInput[]
    disconnect?: RunStepWhereUniqueInput | RunStepWhereUniqueInput[]
    delete?: RunStepWhereUniqueInput | RunStepWhereUniqueInput[]
    connect?: RunStepWhereUniqueInput | RunStepWhereUniqueInput[]
    update?: RunStepUpdateWithWhereUniqueWithoutRunInput | RunStepUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?: RunStepUpdateManyWithWhereWithoutRunInput | RunStepUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: RunStepScalarWhereInput | RunStepScalarWhereInput[]
  }

  export type RunArtifactUncheckedUpdateManyWithoutRunNestedInput = {
    create?: XOR<RunArtifactCreateWithoutRunInput, RunArtifactUncheckedCreateWithoutRunInput> | RunArtifactCreateWithoutRunInput[] | RunArtifactUncheckedCreateWithoutRunInput[]
    connectOrCreate?: RunArtifactCreateOrConnectWithoutRunInput | RunArtifactCreateOrConnectWithoutRunInput[]
    upsert?: RunArtifactUpsertWithWhereUniqueWithoutRunInput | RunArtifactUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: RunArtifactCreateManyRunInputEnvelope
    set?: RunArtifactWhereUniqueInput | RunArtifactWhereUniqueInput[]
    disconnect?: RunArtifactWhereUniqueInput | RunArtifactWhereUniqueInput[]
    delete?: RunArtifactWhereUniqueInput | RunArtifactWhereUniqueInput[]
    connect?: RunArtifactWhereUniqueInput | RunArtifactWhereUniqueInput[]
    update?: RunArtifactUpdateWithWhereUniqueWithoutRunInput | RunArtifactUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?: RunArtifactUpdateManyWithWhereWithoutRunInput | RunArtifactUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: RunArtifactScalarWhereInput | RunArtifactScalarWhereInput[]
  }

  export type RunEvalUncheckedUpdateManyWithoutRunNestedInput = {
    create?: XOR<RunEvalCreateWithoutRunInput, RunEvalUncheckedCreateWithoutRunInput> | RunEvalCreateWithoutRunInput[] | RunEvalUncheckedCreateWithoutRunInput[]
    connectOrCreate?: RunEvalCreateOrConnectWithoutRunInput | RunEvalCreateOrConnectWithoutRunInput[]
    upsert?: RunEvalUpsertWithWhereUniqueWithoutRunInput | RunEvalUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: RunEvalCreateManyRunInputEnvelope
    set?: RunEvalWhereUniqueInput | RunEvalWhereUniqueInput[]
    disconnect?: RunEvalWhereUniqueInput | RunEvalWhereUniqueInput[]
    delete?: RunEvalWhereUniqueInput | RunEvalWhereUniqueInput[]
    connect?: RunEvalWhereUniqueInput | RunEvalWhereUniqueInput[]
    update?: RunEvalUpdateWithWhereUniqueWithoutRunInput | RunEvalUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?: RunEvalUpdateManyWithWhereWithoutRunInput | RunEvalUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: RunEvalScalarWhereInput | RunEvalScalarWhereInput[]
  }

  export type AgentDefinitionCreateNestedOneWithoutSessionsInput = {
    create?: XOR<AgentDefinitionCreateWithoutSessionsInput, AgentDefinitionUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: AgentDefinitionCreateOrConnectWithoutSessionsInput
    connect?: AgentDefinitionWhereUniqueInput
  }

  export type AgentRunCreateNestedManyWithoutSessionInput = {
    create?: XOR<AgentRunCreateWithoutSessionInput, AgentRunUncheckedCreateWithoutSessionInput> | AgentRunCreateWithoutSessionInput[] | AgentRunUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutSessionInput | AgentRunCreateOrConnectWithoutSessionInput[]
    createMany?: AgentRunCreateManySessionInputEnvelope
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
  }

  export type AgentRunUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<AgentRunCreateWithoutSessionInput, AgentRunUncheckedCreateWithoutSessionInput> | AgentRunCreateWithoutSessionInput[] | AgentRunUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutSessionInput | AgentRunCreateOrConnectWithoutSessionInput[]
    createMany?: AgentRunCreateManySessionInputEnvelope
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
  }

  export type AgentDefinitionUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<AgentDefinitionCreateWithoutSessionsInput, AgentDefinitionUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: AgentDefinitionCreateOrConnectWithoutSessionsInput
    upsert?: AgentDefinitionUpsertWithoutSessionsInput
    connect?: AgentDefinitionWhereUniqueInput
    update?: XOR<XOR<AgentDefinitionUpdateToOneWithWhereWithoutSessionsInput, AgentDefinitionUpdateWithoutSessionsInput>, AgentDefinitionUncheckedUpdateWithoutSessionsInput>
  }

  export type AgentRunUpdateManyWithoutSessionNestedInput = {
    create?: XOR<AgentRunCreateWithoutSessionInput, AgentRunUncheckedCreateWithoutSessionInput> | AgentRunCreateWithoutSessionInput[] | AgentRunUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutSessionInput | AgentRunCreateOrConnectWithoutSessionInput[]
    upsert?: AgentRunUpsertWithWhereUniqueWithoutSessionInput | AgentRunUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: AgentRunCreateManySessionInputEnvelope
    set?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    disconnect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    delete?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    update?: AgentRunUpdateWithWhereUniqueWithoutSessionInput | AgentRunUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: AgentRunUpdateManyWithWhereWithoutSessionInput | AgentRunUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
  }

  export type AgentRunUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<AgentRunCreateWithoutSessionInput, AgentRunUncheckedCreateWithoutSessionInput> | AgentRunCreateWithoutSessionInput[] | AgentRunUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutSessionInput | AgentRunCreateOrConnectWithoutSessionInput[]
    upsert?: AgentRunUpsertWithWhereUniqueWithoutSessionInput | AgentRunUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: AgentRunCreateManySessionInputEnvelope
    set?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    disconnect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    delete?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    update?: AgentRunUpdateWithWhereUniqueWithoutSessionInput | AgentRunUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: AgentRunUpdateManyWithWhereWithoutSessionInput | AgentRunUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
  }

  export type AgentRunCreateNestedOneWithoutStepsInput = {
    create?: XOR<AgentRunCreateWithoutStepsInput, AgentRunUncheckedCreateWithoutStepsInput>
    connectOrCreate?: AgentRunCreateOrConnectWithoutStepsInput
    connect?: AgentRunWhereUniqueInput
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type AgentRunUpdateOneRequiredWithoutStepsNestedInput = {
    create?: XOR<AgentRunCreateWithoutStepsInput, AgentRunUncheckedCreateWithoutStepsInput>
    connectOrCreate?: AgentRunCreateOrConnectWithoutStepsInput
    upsert?: AgentRunUpsertWithoutStepsInput
    connect?: AgentRunWhereUniqueInput
    update?: XOR<XOR<AgentRunUpdateToOneWithWhereWithoutStepsInput, AgentRunUpdateWithoutStepsInput>, AgentRunUncheckedUpdateWithoutStepsInput>
  }

  export type AgentRunCreateNestedOneWithoutArtifactsInput = {
    create?: XOR<AgentRunCreateWithoutArtifactsInput, AgentRunUncheckedCreateWithoutArtifactsInput>
    connectOrCreate?: AgentRunCreateOrConnectWithoutArtifactsInput
    connect?: AgentRunWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type AgentRunUpdateOneRequiredWithoutArtifactsNestedInput = {
    create?: XOR<AgentRunCreateWithoutArtifactsInput, AgentRunUncheckedCreateWithoutArtifactsInput>
    connectOrCreate?: AgentRunCreateOrConnectWithoutArtifactsInput
    upsert?: AgentRunUpsertWithoutArtifactsInput
    connect?: AgentRunWhereUniqueInput
    update?: XOR<XOR<AgentRunUpdateToOneWithWhereWithoutArtifactsInput, AgentRunUpdateWithoutArtifactsInput>, AgentRunUncheckedUpdateWithoutArtifactsInput>
  }

  export type AgentRunCreateNestedOneWithoutEvalsInput = {
    create?: XOR<AgentRunCreateWithoutEvalsInput, AgentRunUncheckedCreateWithoutEvalsInput>
    connectOrCreate?: AgentRunCreateOrConnectWithoutEvalsInput
    connect?: AgentRunWhereUniqueInput
  }

  export type AgentRunUpdateOneRequiredWithoutEvalsNestedInput = {
    create?: XOR<AgentRunCreateWithoutEvalsInput, AgentRunUncheckedCreateWithoutEvalsInput>
    connectOrCreate?: AgentRunCreateOrConnectWithoutEvalsInput
    upsert?: AgentRunUpsertWithoutEvalsInput
    connect?: AgentRunWhereUniqueInput
    update?: XOR<XOR<AgentRunUpdateToOneWithWhereWithoutEvalsInput, AgentRunUpdateWithoutEvalsInput>, AgentRunUncheckedUpdateWithoutEvalsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type AgentVersionCreateWithoutAgentDefinitionInput = {
    id: string
    version: number
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog: string
    createdAt?: Date | string
  }

  export type AgentVersionUncheckedCreateWithoutAgentDefinitionInput = {
    id: string
    version: number
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog: string
    createdAt?: Date | string
  }

  export type AgentVersionCreateOrConnectWithoutAgentDefinitionInput = {
    where: AgentVersionWhereUniqueInput
    create: XOR<AgentVersionCreateWithoutAgentDefinitionInput, AgentVersionUncheckedCreateWithoutAgentDefinitionInput>
  }

  export type AgentVersionCreateManyAgentDefinitionInputEnvelope = {
    data: AgentVersionCreateManyAgentDefinitionInput | AgentVersionCreateManyAgentDefinitionInput[]
  }

  export type AgentRunCreateWithoutAgentDefinitionInput = {
    id: string
    agentVersionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    session?: ConversationSessionCreateNestedOneWithoutRunsInput
    steps?: RunStepCreateNestedManyWithoutRunInput
    artifacts?: RunArtifactCreateNestedManyWithoutRunInput
    evals?: RunEvalCreateNestedManyWithoutRunInput
  }

  export type AgentRunUncheckedCreateWithoutAgentDefinitionInput = {
    id: string
    agentVersionId?: string | null
    sessionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    steps?: RunStepUncheckedCreateNestedManyWithoutRunInput
    artifacts?: RunArtifactUncheckedCreateNestedManyWithoutRunInput
    evals?: RunEvalUncheckedCreateNestedManyWithoutRunInput
  }

  export type AgentRunCreateOrConnectWithoutAgentDefinitionInput = {
    where: AgentRunWhereUniqueInput
    create: XOR<AgentRunCreateWithoutAgentDefinitionInput, AgentRunUncheckedCreateWithoutAgentDefinitionInput>
  }

  export type AgentRunCreateManyAgentDefinitionInputEnvelope = {
    data: AgentRunCreateManyAgentDefinitionInput | AgentRunCreateManyAgentDefinitionInput[]
  }

  export type ConversationSessionCreateWithoutAgentDefinitionInput = {
    id: string
    status?: string
    participantId?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    runs?: AgentRunCreateNestedManyWithoutSessionInput
  }

  export type ConversationSessionUncheckedCreateWithoutAgentDefinitionInput = {
    id: string
    status?: string
    participantId?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    runs?: AgentRunUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ConversationSessionCreateOrConnectWithoutAgentDefinitionInput = {
    where: ConversationSessionWhereUniqueInput
    create: XOR<ConversationSessionCreateWithoutAgentDefinitionInput, ConversationSessionUncheckedCreateWithoutAgentDefinitionInput>
  }

  export type ConversationSessionCreateManyAgentDefinitionInputEnvelope = {
    data: ConversationSessionCreateManyAgentDefinitionInput | ConversationSessionCreateManyAgentDefinitionInput[]
  }

  export type AgentVersionUpsertWithWhereUniqueWithoutAgentDefinitionInput = {
    where: AgentVersionWhereUniqueInput
    update: XOR<AgentVersionUpdateWithoutAgentDefinitionInput, AgentVersionUncheckedUpdateWithoutAgentDefinitionInput>
    create: XOR<AgentVersionCreateWithoutAgentDefinitionInput, AgentVersionUncheckedCreateWithoutAgentDefinitionInput>
  }

  export type AgentVersionUpdateWithWhereUniqueWithoutAgentDefinitionInput = {
    where: AgentVersionWhereUniqueInput
    data: XOR<AgentVersionUpdateWithoutAgentDefinitionInput, AgentVersionUncheckedUpdateWithoutAgentDefinitionInput>
  }

  export type AgentVersionUpdateManyWithWhereWithoutAgentDefinitionInput = {
    where: AgentVersionScalarWhereInput
    data: XOR<AgentVersionUpdateManyMutationInput, AgentVersionUncheckedUpdateManyWithoutAgentDefinitionInput>
  }

  export type AgentVersionScalarWhereInput = {
    AND?: AgentVersionScalarWhereInput | AgentVersionScalarWhereInput[]
    OR?: AgentVersionScalarWhereInput[]
    NOT?: AgentVersionScalarWhereInput | AgentVersionScalarWhereInput[]
    id?: StringFilter<"AgentVersion"> | string
    agentDefinitionId?: StringFilter<"AgentVersion"> | string
    version?: IntFilter<"AgentVersion"> | number
    instructions?: StringFilter<"AgentVersion"> | string
    allowedTools?: JsonFilter<"AgentVersion">
    defaultModel?: StringFilter<"AgentVersion"> | string
    outputSchema?: JsonNullableFilter<"AgentVersion">
    flowDefinition?: JsonNullableFilter<"AgentVersion">
    changelog?: StringFilter<"AgentVersion"> | string
    createdAt?: DateTimeFilter<"AgentVersion"> | Date | string
  }

  export type AgentRunUpsertWithWhereUniqueWithoutAgentDefinitionInput = {
    where: AgentRunWhereUniqueInput
    update: XOR<AgentRunUpdateWithoutAgentDefinitionInput, AgentRunUncheckedUpdateWithoutAgentDefinitionInput>
    create: XOR<AgentRunCreateWithoutAgentDefinitionInput, AgentRunUncheckedCreateWithoutAgentDefinitionInput>
  }

  export type AgentRunUpdateWithWhereUniqueWithoutAgentDefinitionInput = {
    where: AgentRunWhereUniqueInput
    data: XOR<AgentRunUpdateWithoutAgentDefinitionInput, AgentRunUncheckedUpdateWithoutAgentDefinitionInput>
  }

  export type AgentRunUpdateManyWithWhereWithoutAgentDefinitionInput = {
    where: AgentRunScalarWhereInput
    data: XOR<AgentRunUpdateManyMutationInput, AgentRunUncheckedUpdateManyWithoutAgentDefinitionInput>
  }

  export type AgentRunScalarWhereInput = {
    AND?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
    OR?: AgentRunScalarWhereInput[]
    NOT?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
    id?: StringFilter<"AgentRun"> | string
    agentDefinitionId?: StringFilter<"AgentRun"> | string
    agentVersionId?: StringNullableFilter<"AgentRun"> | string | null
    sessionId?: StringNullableFilter<"AgentRun"> | string | null
    status?: StringFilter<"AgentRun"> | string
    input?: StringFilter<"AgentRun"> | string
    finalOutput?: StringNullableFilter<"AgentRun"> | string | null
    tokenUsage?: JsonNullableFilter<"AgentRun">
    costEstimate?: FloatNullableFilter<"AgentRun"> | number | null
    durationMs?: IntNullableFilter<"AgentRun"> | number | null
    error?: StringNullableFilter<"AgentRun"> | string | null
    triggeredBy?: StringFilter<"AgentRun"> | string
    meta?: JsonFilter<"AgentRun">
    createdAt?: DateTimeFilter<"AgentRun"> | Date | string
    updatedAt?: DateTimeFilter<"AgentRun"> | Date | string
  }

  export type ConversationSessionUpsertWithWhereUniqueWithoutAgentDefinitionInput = {
    where: ConversationSessionWhereUniqueInput
    update: XOR<ConversationSessionUpdateWithoutAgentDefinitionInput, ConversationSessionUncheckedUpdateWithoutAgentDefinitionInput>
    create: XOR<ConversationSessionCreateWithoutAgentDefinitionInput, ConversationSessionUncheckedCreateWithoutAgentDefinitionInput>
  }

  export type ConversationSessionUpdateWithWhereUniqueWithoutAgentDefinitionInput = {
    where: ConversationSessionWhereUniqueInput
    data: XOR<ConversationSessionUpdateWithoutAgentDefinitionInput, ConversationSessionUncheckedUpdateWithoutAgentDefinitionInput>
  }

  export type ConversationSessionUpdateManyWithWhereWithoutAgentDefinitionInput = {
    where: ConversationSessionScalarWhereInput
    data: XOR<ConversationSessionUpdateManyMutationInput, ConversationSessionUncheckedUpdateManyWithoutAgentDefinitionInput>
  }

  export type ConversationSessionScalarWhereInput = {
    AND?: ConversationSessionScalarWhereInput | ConversationSessionScalarWhereInput[]
    OR?: ConversationSessionScalarWhereInput[]
    NOT?: ConversationSessionScalarWhereInput | ConversationSessionScalarWhereInput[]
    id?: StringFilter<"ConversationSession"> | string
    agentDefinitionId?: StringFilter<"ConversationSession"> | string
    status?: StringFilter<"ConversationSession"> | string
    participantId?: StringNullableFilter<"ConversationSession"> | string | null
    meta?: JsonFilter<"ConversationSession">
    createdAt?: DateTimeFilter<"ConversationSession"> | Date | string
    updatedAt?: DateTimeFilter<"ConversationSession"> | Date | string
  }

  export type AgentDefinitionCreateWithoutVersionsInput = {
    id: string
    name: string
    slug: string
    description?: string
    kind: string
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    publishToken?: string | null
    publishedAt?: Date | string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    runs?: AgentRunCreateNestedManyWithoutAgentDefinitionInput
    sessions?: ConversationSessionCreateNestedManyWithoutAgentDefinitionInput
  }

  export type AgentDefinitionUncheckedCreateWithoutVersionsInput = {
    id: string
    name: string
    slug: string
    description?: string
    kind: string
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    publishToken?: string | null
    publishedAt?: Date | string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    runs?: AgentRunUncheckedCreateNestedManyWithoutAgentDefinitionInput
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutAgentDefinitionInput
  }

  export type AgentDefinitionCreateOrConnectWithoutVersionsInput = {
    where: AgentDefinitionWhereUniqueInput
    create: XOR<AgentDefinitionCreateWithoutVersionsInput, AgentDefinitionUncheckedCreateWithoutVersionsInput>
  }

  export type AgentDefinitionUpsertWithoutVersionsInput = {
    update: XOR<AgentDefinitionUpdateWithoutVersionsInput, AgentDefinitionUncheckedUpdateWithoutVersionsInput>
    create: XOR<AgentDefinitionCreateWithoutVersionsInput, AgentDefinitionUncheckedCreateWithoutVersionsInput>
    where?: AgentDefinitionWhereInput
  }

  export type AgentDefinitionUpdateToOneWithWhereWithoutVersionsInput = {
    where?: AgentDefinitionWhereInput
    data: XOR<AgentDefinitionUpdateWithoutVersionsInput, AgentDefinitionUncheckedUpdateWithoutVersionsInput>
  }

  export type AgentDefinitionUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    publishToken?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    runs?: AgentRunUpdateManyWithoutAgentDefinitionNestedInput
    sessions?: ConversationSessionUpdateManyWithoutAgentDefinitionNestedInput
  }

  export type AgentDefinitionUncheckedUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    publishToken?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    runs?: AgentRunUncheckedUpdateManyWithoutAgentDefinitionNestedInput
    sessions?: ConversationSessionUncheckedUpdateManyWithoutAgentDefinitionNestedInput
  }

  export type AgentDefinitionCreateWithoutRunsInput = {
    id: string
    name: string
    slug: string
    description?: string
    kind: string
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    publishToken?: string | null
    publishedAt?: Date | string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: AgentVersionCreateNestedManyWithoutAgentDefinitionInput
    sessions?: ConversationSessionCreateNestedManyWithoutAgentDefinitionInput
  }

  export type AgentDefinitionUncheckedCreateWithoutRunsInput = {
    id: string
    name: string
    slug: string
    description?: string
    kind: string
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    publishToken?: string | null
    publishedAt?: Date | string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: AgentVersionUncheckedCreateNestedManyWithoutAgentDefinitionInput
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutAgentDefinitionInput
  }

  export type AgentDefinitionCreateOrConnectWithoutRunsInput = {
    where: AgentDefinitionWhereUniqueInput
    create: XOR<AgentDefinitionCreateWithoutRunsInput, AgentDefinitionUncheckedCreateWithoutRunsInput>
  }

  export type ConversationSessionCreateWithoutRunsInput = {
    id: string
    status?: string
    participantId?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    agentDefinition: AgentDefinitionCreateNestedOneWithoutSessionsInput
  }

  export type ConversationSessionUncheckedCreateWithoutRunsInput = {
    id: string
    agentDefinitionId: string
    status?: string
    participantId?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationSessionCreateOrConnectWithoutRunsInput = {
    where: ConversationSessionWhereUniqueInput
    create: XOR<ConversationSessionCreateWithoutRunsInput, ConversationSessionUncheckedCreateWithoutRunsInput>
  }

  export type RunStepCreateWithoutRunInput = {
    id: string
    stepIndex: number
    kind: string
    status: string
    toolName?: string | null
    nodeId?: string | null
    input: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: number | null
    error?: string | null
    validationPassed?: boolean | null
    createdAt?: Date | string
  }

  export type RunStepUncheckedCreateWithoutRunInput = {
    id: string
    stepIndex: number
    kind: string
    status: string
    toolName?: string | null
    nodeId?: string | null
    input: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: number | null
    error?: string | null
    validationPassed?: boolean | null
    createdAt?: Date | string
  }

  export type RunStepCreateOrConnectWithoutRunInput = {
    where: RunStepWhereUniqueInput
    create: XOR<RunStepCreateWithoutRunInput, RunStepUncheckedCreateWithoutRunInput>
  }

  export type RunStepCreateManyRunInputEnvelope = {
    data: RunStepCreateManyRunInput | RunStepCreateManyRunInput[]
  }

  export type RunArtifactCreateWithoutRunInput = {
    id: string
    kind: string
    targetType?: string | null
    targetId?: string | null
    data: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: Date | string | null
    appliedBy?: string | null
    rejected?: boolean
    rejectedReason?: string | null
    rejectedAt?: Date | string | null
    rejectedBy?: string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RunArtifactUncheckedCreateWithoutRunInput = {
    id: string
    kind: string
    targetType?: string | null
    targetId?: string | null
    data: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: Date | string | null
    appliedBy?: string | null
    rejected?: boolean
    rejectedReason?: string | null
    rejectedAt?: Date | string | null
    rejectedBy?: string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RunArtifactCreateOrConnectWithoutRunInput = {
    where: RunArtifactWhereUniqueInput
    create: XOR<RunArtifactCreateWithoutRunInput, RunArtifactUncheckedCreateWithoutRunInput>
  }

  export type RunArtifactCreateManyRunInputEnvelope = {
    data: RunArtifactCreateManyRunInput | RunArtifactCreateManyRunInput[]
  }

  export type RunEvalCreateWithoutRunInput = {
    id: string
    evalName: string
    score?: number | null
    pass?: boolean | null
    reasoning?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RunEvalUncheckedCreateWithoutRunInput = {
    id: string
    evalName: string
    score?: number | null
    pass?: boolean | null
    reasoning?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RunEvalCreateOrConnectWithoutRunInput = {
    where: RunEvalWhereUniqueInput
    create: XOR<RunEvalCreateWithoutRunInput, RunEvalUncheckedCreateWithoutRunInput>
  }

  export type RunEvalCreateManyRunInputEnvelope = {
    data: RunEvalCreateManyRunInput | RunEvalCreateManyRunInput[]
  }

  export type AgentDefinitionUpsertWithoutRunsInput = {
    update: XOR<AgentDefinitionUpdateWithoutRunsInput, AgentDefinitionUncheckedUpdateWithoutRunsInput>
    create: XOR<AgentDefinitionCreateWithoutRunsInput, AgentDefinitionUncheckedCreateWithoutRunsInput>
    where?: AgentDefinitionWhereInput
  }

  export type AgentDefinitionUpdateToOneWithWhereWithoutRunsInput = {
    where?: AgentDefinitionWhereInput
    data: XOR<AgentDefinitionUpdateWithoutRunsInput, AgentDefinitionUncheckedUpdateWithoutRunsInput>
  }

  export type AgentDefinitionUpdateWithoutRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    publishToken?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: AgentVersionUpdateManyWithoutAgentDefinitionNestedInput
    sessions?: ConversationSessionUpdateManyWithoutAgentDefinitionNestedInput
  }

  export type AgentDefinitionUncheckedUpdateWithoutRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    publishToken?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: AgentVersionUncheckedUpdateManyWithoutAgentDefinitionNestedInput
    sessions?: ConversationSessionUncheckedUpdateManyWithoutAgentDefinitionNestedInput
  }

  export type ConversationSessionUpsertWithoutRunsInput = {
    update: XOR<ConversationSessionUpdateWithoutRunsInput, ConversationSessionUncheckedUpdateWithoutRunsInput>
    create: XOR<ConversationSessionCreateWithoutRunsInput, ConversationSessionUncheckedCreateWithoutRunsInput>
    where?: ConversationSessionWhereInput
  }

  export type ConversationSessionUpdateToOneWithWhereWithoutRunsInput = {
    where?: ConversationSessionWhereInput
    data: XOR<ConversationSessionUpdateWithoutRunsInput, ConversationSessionUncheckedUpdateWithoutRunsInput>
  }

  export type ConversationSessionUpdateWithoutRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentDefinition?: AgentDefinitionUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type ConversationSessionUncheckedUpdateWithoutRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentDefinitionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunStepUpsertWithWhereUniqueWithoutRunInput = {
    where: RunStepWhereUniqueInput
    update: XOR<RunStepUpdateWithoutRunInput, RunStepUncheckedUpdateWithoutRunInput>
    create: XOR<RunStepCreateWithoutRunInput, RunStepUncheckedCreateWithoutRunInput>
  }

  export type RunStepUpdateWithWhereUniqueWithoutRunInput = {
    where: RunStepWhereUniqueInput
    data: XOR<RunStepUpdateWithoutRunInput, RunStepUncheckedUpdateWithoutRunInput>
  }

  export type RunStepUpdateManyWithWhereWithoutRunInput = {
    where: RunStepScalarWhereInput
    data: XOR<RunStepUpdateManyMutationInput, RunStepUncheckedUpdateManyWithoutRunInput>
  }

  export type RunStepScalarWhereInput = {
    AND?: RunStepScalarWhereInput | RunStepScalarWhereInput[]
    OR?: RunStepScalarWhereInput[]
    NOT?: RunStepScalarWhereInput | RunStepScalarWhereInput[]
    id?: StringFilter<"RunStep"> | string
    runId?: StringFilter<"RunStep"> | string
    stepIndex?: IntFilter<"RunStep"> | number
    kind?: StringFilter<"RunStep"> | string
    status?: StringFilter<"RunStep"> | string
    toolName?: StringNullableFilter<"RunStep"> | string | null
    nodeId?: StringNullableFilter<"RunStep"> | string | null
    input?: JsonFilter<"RunStep">
    output?: JsonNullableFilter<"RunStep">
    tokenUsage?: JsonNullableFilter<"RunStep">
    durationMs?: IntNullableFilter<"RunStep"> | number | null
    error?: StringNullableFilter<"RunStep"> | string | null
    validationPassed?: BoolNullableFilter<"RunStep"> | boolean | null
    createdAt?: DateTimeFilter<"RunStep"> | Date | string
  }

  export type RunArtifactUpsertWithWhereUniqueWithoutRunInput = {
    where: RunArtifactWhereUniqueInput
    update: XOR<RunArtifactUpdateWithoutRunInput, RunArtifactUncheckedUpdateWithoutRunInput>
    create: XOR<RunArtifactCreateWithoutRunInput, RunArtifactUncheckedCreateWithoutRunInput>
  }

  export type RunArtifactUpdateWithWhereUniqueWithoutRunInput = {
    where: RunArtifactWhereUniqueInput
    data: XOR<RunArtifactUpdateWithoutRunInput, RunArtifactUncheckedUpdateWithoutRunInput>
  }

  export type RunArtifactUpdateManyWithWhereWithoutRunInput = {
    where: RunArtifactScalarWhereInput
    data: XOR<RunArtifactUpdateManyMutationInput, RunArtifactUncheckedUpdateManyWithoutRunInput>
  }

  export type RunArtifactScalarWhereInput = {
    AND?: RunArtifactScalarWhereInput | RunArtifactScalarWhereInput[]
    OR?: RunArtifactScalarWhereInput[]
    NOT?: RunArtifactScalarWhereInput | RunArtifactScalarWhereInput[]
    id?: StringFilter<"RunArtifact"> | string
    runId?: StringFilter<"RunArtifact"> | string
    kind?: StringFilter<"RunArtifact"> | string
    targetType?: StringNullableFilter<"RunArtifact"> | string | null
    targetId?: StringNullableFilter<"RunArtifact"> | string | null
    data?: JsonFilter<"RunArtifact">
    previousData?: JsonNullableFilter<"RunArtifact">
    appliedAt?: DateTimeNullableFilter<"RunArtifact"> | Date | string | null
    appliedBy?: StringNullableFilter<"RunArtifact"> | string | null
    rejected?: BoolFilter<"RunArtifact"> | boolean
    rejectedReason?: StringNullableFilter<"RunArtifact"> | string | null
    rejectedAt?: DateTimeNullableFilter<"RunArtifact"> | Date | string | null
    rejectedBy?: StringNullableFilter<"RunArtifact"> | string | null
    proposalOutcome?: JsonNullableFilter<"RunArtifact">
    ignoredAt?: DateTimeNullableFilter<"RunArtifact"> | Date | string | null
    createdAt?: DateTimeFilter<"RunArtifact"> | Date | string
  }

  export type RunEvalUpsertWithWhereUniqueWithoutRunInput = {
    where: RunEvalWhereUniqueInput
    update: XOR<RunEvalUpdateWithoutRunInput, RunEvalUncheckedUpdateWithoutRunInput>
    create: XOR<RunEvalCreateWithoutRunInput, RunEvalUncheckedCreateWithoutRunInput>
  }

  export type RunEvalUpdateWithWhereUniqueWithoutRunInput = {
    where: RunEvalWhereUniqueInput
    data: XOR<RunEvalUpdateWithoutRunInput, RunEvalUncheckedUpdateWithoutRunInput>
  }

  export type RunEvalUpdateManyWithWhereWithoutRunInput = {
    where: RunEvalScalarWhereInput
    data: XOR<RunEvalUpdateManyMutationInput, RunEvalUncheckedUpdateManyWithoutRunInput>
  }

  export type RunEvalScalarWhereInput = {
    AND?: RunEvalScalarWhereInput | RunEvalScalarWhereInput[]
    OR?: RunEvalScalarWhereInput[]
    NOT?: RunEvalScalarWhereInput | RunEvalScalarWhereInput[]
    id?: StringFilter<"RunEval"> | string
    runId?: StringFilter<"RunEval"> | string
    evalName?: StringFilter<"RunEval"> | string
    score?: FloatNullableFilter<"RunEval"> | number | null
    pass?: BoolNullableFilter<"RunEval"> | boolean | null
    reasoning?: StringNullableFilter<"RunEval"> | string | null
    meta?: JsonFilter<"RunEval">
    createdAt?: DateTimeFilter<"RunEval"> | Date | string
  }

  export type AgentDefinitionCreateWithoutSessionsInput = {
    id: string
    name: string
    slug: string
    description?: string
    kind: string
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    publishToken?: string | null
    publishedAt?: Date | string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: AgentVersionCreateNestedManyWithoutAgentDefinitionInput
    runs?: AgentRunCreateNestedManyWithoutAgentDefinitionInput
  }

  export type AgentDefinitionUncheckedCreateWithoutSessionsInput = {
    id: string
    name: string
    slug: string
    description?: string
    kind: string
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: string
    publishToken?: string | null
    publishedAt?: Date | string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: AgentVersionUncheckedCreateNestedManyWithoutAgentDefinitionInput
    runs?: AgentRunUncheckedCreateNestedManyWithoutAgentDefinitionInput
  }

  export type AgentDefinitionCreateOrConnectWithoutSessionsInput = {
    where: AgentDefinitionWhereUniqueInput
    create: XOR<AgentDefinitionCreateWithoutSessionsInput, AgentDefinitionUncheckedCreateWithoutSessionsInput>
  }

  export type AgentRunCreateWithoutSessionInput = {
    id: string
    agentVersionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    agentDefinition: AgentDefinitionCreateNestedOneWithoutRunsInput
    steps?: RunStepCreateNestedManyWithoutRunInput
    artifacts?: RunArtifactCreateNestedManyWithoutRunInput
    evals?: RunEvalCreateNestedManyWithoutRunInput
  }

  export type AgentRunUncheckedCreateWithoutSessionInput = {
    id: string
    agentDefinitionId: string
    agentVersionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    steps?: RunStepUncheckedCreateNestedManyWithoutRunInput
    artifacts?: RunArtifactUncheckedCreateNestedManyWithoutRunInput
    evals?: RunEvalUncheckedCreateNestedManyWithoutRunInput
  }

  export type AgentRunCreateOrConnectWithoutSessionInput = {
    where: AgentRunWhereUniqueInput
    create: XOR<AgentRunCreateWithoutSessionInput, AgentRunUncheckedCreateWithoutSessionInput>
  }

  export type AgentRunCreateManySessionInputEnvelope = {
    data: AgentRunCreateManySessionInput | AgentRunCreateManySessionInput[]
  }

  export type AgentDefinitionUpsertWithoutSessionsInput = {
    update: XOR<AgentDefinitionUpdateWithoutSessionsInput, AgentDefinitionUncheckedUpdateWithoutSessionsInput>
    create: XOR<AgentDefinitionCreateWithoutSessionsInput, AgentDefinitionUncheckedCreateWithoutSessionsInput>
    where?: AgentDefinitionWhereInput
  }

  export type AgentDefinitionUpdateToOneWithWhereWithoutSessionsInput = {
    where?: AgentDefinitionWhereInput
    data: XOR<AgentDefinitionUpdateWithoutSessionsInput, AgentDefinitionUncheckedUpdateWithoutSessionsInput>
  }

  export type AgentDefinitionUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    publishToken?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: AgentVersionUpdateManyWithoutAgentDefinitionNestedInput
    runs?: AgentRunUpdateManyWithoutAgentDefinitionNestedInput
  }

  export type AgentDefinitionUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    publishToken?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: AgentVersionUncheckedUpdateManyWithoutAgentDefinitionNestedInput
    runs?: AgentRunUncheckedUpdateManyWithoutAgentDefinitionNestedInput
  }

  export type AgentRunUpsertWithWhereUniqueWithoutSessionInput = {
    where: AgentRunWhereUniqueInput
    update: XOR<AgentRunUpdateWithoutSessionInput, AgentRunUncheckedUpdateWithoutSessionInput>
    create: XOR<AgentRunCreateWithoutSessionInput, AgentRunUncheckedCreateWithoutSessionInput>
  }

  export type AgentRunUpdateWithWhereUniqueWithoutSessionInput = {
    where: AgentRunWhereUniqueInput
    data: XOR<AgentRunUpdateWithoutSessionInput, AgentRunUncheckedUpdateWithoutSessionInput>
  }

  export type AgentRunUpdateManyWithWhereWithoutSessionInput = {
    where: AgentRunScalarWhereInput
    data: XOR<AgentRunUpdateManyMutationInput, AgentRunUncheckedUpdateManyWithoutSessionInput>
  }

  export type AgentRunCreateWithoutStepsInput = {
    id: string
    agentVersionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    agentDefinition: AgentDefinitionCreateNestedOneWithoutRunsInput
    session?: ConversationSessionCreateNestedOneWithoutRunsInput
    artifacts?: RunArtifactCreateNestedManyWithoutRunInput
    evals?: RunEvalCreateNestedManyWithoutRunInput
  }

  export type AgentRunUncheckedCreateWithoutStepsInput = {
    id: string
    agentDefinitionId: string
    agentVersionId?: string | null
    sessionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    artifacts?: RunArtifactUncheckedCreateNestedManyWithoutRunInput
    evals?: RunEvalUncheckedCreateNestedManyWithoutRunInput
  }

  export type AgentRunCreateOrConnectWithoutStepsInput = {
    where: AgentRunWhereUniqueInput
    create: XOR<AgentRunCreateWithoutStepsInput, AgentRunUncheckedCreateWithoutStepsInput>
  }

  export type AgentRunUpsertWithoutStepsInput = {
    update: XOR<AgentRunUpdateWithoutStepsInput, AgentRunUncheckedUpdateWithoutStepsInput>
    create: XOR<AgentRunCreateWithoutStepsInput, AgentRunUncheckedCreateWithoutStepsInput>
    where?: AgentRunWhereInput
  }

  export type AgentRunUpdateToOneWithWhereWithoutStepsInput = {
    where?: AgentRunWhereInput
    data: XOR<AgentRunUpdateWithoutStepsInput, AgentRunUncheckedUpdateWithoutStepsInput>
  }

  export type AgentRunUpdateWithoutStepsInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentDefinition?: AgentDefinitionUpdateOneRequiredWithoutRunsNestedInput
    session?: ConversationSessionUpdateOneWithoutRunsNestedInput
    artifacts?: RunArtifactUpdateManyWithoutRunNestedInput
    evals?: RunEvalUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateWithoutStepsInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentDefinitionId?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    artifacts?: RunArtifactUncheckedUpdateManyWithoutRunNestedInput
    evals?: RunEvalUncheckedUpdateManyWithoutRunNestedInput
  }

  export type AgentRunCreateWithoutArtifactsInput = {
    id: string
    agentVersionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    agentDefinition: AgentDefinitionCreateNestedOneWithoutRunsInput
    session?: ConversationSessionCreateNestedOneWithoutRunsInput
    steps?: RunStepCreateNestedManyWithoutRunInput
    evals?: RunEvalCreateNestedManyWithoutRunInput
  }

  export type AgentRunUncheckedCreateWithoutArtifactsInput = {
    id: string
    agentDefinitionId: string
    agentVersionId?: string | null
    sessionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    steps?: RunStepUncheckedCreateNestedManyWithoutRunInput
    evals?: RunEvalUncheckedCreateNestedManyWithoutRunInput
  }

  export type AgentRunCreateOrConnectWithoutArtifactsInput = {
    where: AgentRunWhereUniqueInput
    create: XOR<AgentRunCreateWithoutArtifactsInput, AgentRunUncheckedCreateWithoutArtifactsInput>
  }

  export type AgentRunUpsertWithoutArtifactsInput = {
    update: XOR<AgentRunUpdateWithoutArtifactsInput, AgentRunUncheckedUpdateWithoutArtifactsInput>
    create: XOR<AgentRunCreateWithoutArtifactsInput, AgentRunUncheckedCreateWithoutArtifactsInput>
    where?: AgentRunWhereInput
  }

  export type AgentRunUpdateToOneWithWhereWithoutArtifactsInput = {
    where?: AgentRunWhereInput
    data: XOR<AgentRunUpdateWithoutArtifactsInput, AgentRunUncheckedUpdateWithoutArtifactsInput>
  }

  export type AgentRunUpdateWithoutArtifactsInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentDefinition?: AgentDefinitionUpdateOneRequiredWithoutRunsNestedInput
    session?: ConversationSessionUpdateOneWithoutRunsNestedInput
    steps?: RunStepUpdateManyWithoutRunNestedInput
    evals?: RunEvalUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateWithoutArtifactsInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentDefinitionId?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    steps?: RunStepUncheckedUpdateManyWithoutRunNestedInput
    evals?: RunEvalUncheckedUpdateManyWithoutRunNestedInput
  }

  export type AgentRunCreateWithoutEvalsInput = {
    id: string
    agentVersionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    agentDefinition: AgentDefinitionCreateNestedOneWithoutRunsInput
    session?: ConversationSessionCreateNestedOneWithoutRunsInput
    steps?: RunStepCreateNestedManyWithoutRunInput
    artifacts?: RunArtifactCreateNestedManyWithoutRunInput
  }

  export type AgentRunUncheckedCreateWithoutEvalsInput = {
    id: string
    agentDefinitionId: string
    agentVersionId?: string | null
    sessionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    steps?: RunStepUncheckedCreateNestedManyWithoutRunInput
    artifacts?: RunArtifactUncheckedCreateNestedManyWithoutRunInput
  }

  export type AgentRunCreateOrConnectWithoutEvalsInput = {
    where: AgentRunWhereUniqueInput
    create: XOR<AgentRunCreateWithoutEvalsInput, AgentRunUncheckedCreateWithoutEvalsInput>
  }

  export type AgentRunUpsertWithoutEvalsInput = {
    update: XOR<AgentRunUpdateWithoutEvalsInput, AgentRunUncheckedUpdateWithoutEvalsInput>
    create: XOR<AgentRunCreateWithoutEvalsInput, AgentRunUncheckedCreateWithoutEvalsInput>
    where?: AgentRunWhereInput
  }

  export type AgentRunUpdateToOneWithWhereWithoutEvalsInput = {
    where?: AgentRunWhereInput
    data: XOR<AgentRunUpdateWithoutEvalsInput, AgentRunUncheckedUpdateWithoutEvalsInput>
  }

  export type AgentRunUpdateWithoutEvalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentDefinition?: AgentDefinitionUpdateOneRequiredWithoutRunsNestedInput
    session?: ConversationSessionUpdateOneWithoutRunsNestedInput
    steps?: RunStepUpdateManyWithoutRunNestedInput
    artifacts?: RunArtifactUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateWithoutEvalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentDefinitionId?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    steps?: RunStepUncheckedUpdateManyWithoutRunNestedInput
    artifacts?: RunArtifactUncheckedUpdateManyWithoutRunNestedInput
  }

  export type AgentVersionCreateManyAgentDefinitionInput = {
    id: string
    version: number
    instructions: string
    allowedTools: JsonNullValueInput | InputJsonValue
    defaultModel: string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog: string
    createdAt?: Date | string
  }

  export type AgentRunCreateManyAgentDefinitionInput = {
    id: string
    agentVersionId?: string | null
    sessionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationSessionCreateManyAgentDefinitionInput = {
    id: string
    status?: string
    participantId?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentVersionUpdateWithoutAgentDefinitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentVersionUncheckedUpdateWithoutAgentDefinitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentVersionUncheckedUpdateManyWithoutAgentDefinitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    instructions?: StringFieldUpdateOperationsInput | string
    allowedTools?: JsonNullValueInput | InputJsonValue
    defaultModel?: StringFieldUpdateOperationsInput | string
    outputSchema?: NullableJsonNullValueInput | InputJsonValue
    flowDefinition?: NullableJsonNullValueInput | InputJsonValue
    changelog?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentRunUpdateWithoutAgentDefinitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: ConversationSessionUpdateOneWithoutRunsNestedInput
    steps?: RunStepUpdateManyWithoutRunNestedInput
    artifacts?: RunArtifactUpdateManyWithoutRunNestedInput
    evals?: RunEvalUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateWithoutAgentDefinitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    steps?: RunStepUncheckedUpdateManyWithoutRunNestedInput
    artifacts?: RunArtifactUncheckedUpdateManyWithoutRunNestedInput
    evals?: RunEvalUncheckedUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateManyWithoutAgentDefinitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationSessionUpdateWithoutAgentDefinitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    runs?: AgentRunUpdateManyWithoutSessionNestedInput
  }

  export type ConversationSessionUncheckedUpdateWithoutAgentDefinitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    runs?: AgentRunUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ConversationSessionUncheckedUpdateManyWithoutAgentDefinitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunStepCreateManyRunInput = {
    id: string
    stepIndex: number
    kind: string
    status: string
    toolName?: string | null
    nodeId?: string | null
    input: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: number | null
    error?: string | null
    validationPassed?: boolean | null
    createdAt?: Date | string
  }

  export type RunArtifactCreateManyRunInput = {
    id: string
    kind: string
    targetType?: string | null
    targetId?: string | null
    data: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: Date | string | null
    appliedBy?: string | null
    rejected?: boolean
    rejectedReason?: string | null
    rejectedAt?: Date | string | null
    rejectedBy?: string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RunEvalCreateManyRunInput = {
    id: string
    evalName: string
    score?: number | null
    pass?: boolean | null
    reasoning?: string | null
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RunStepUpdateWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    stepIndex?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    validationPassed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunStepUncheckedUpdateWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    stepIndex?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    validationPassed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunStepUncheckedUpdateManyWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    stepIndex?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    validationPassed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunArtifactUpdateWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appliedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejected?: BoolFieldUpdateOperationsInput | boolean
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedBy?: NullableStringFieldUpdateOperationsInput | string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunArtifactUncheckedUpdateWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appliedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejected?: BoolFieldUpdateOperationsInput | boolean
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedBy?: NullableStringFieldUpdateOperationsInput | string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunArtifactUncheckedUpdateManyWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: JsonNullValueInput | InputJsonValue
    previousData?: NullableJsonNullValueInput | InputJsonValue
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appliedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejected?: BoolFieldUpdateOperationsInput | boolean
    rejectedReason?: NullableStringFieldUpdateOperationsInput | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedBy?: NullableStringFieldUpdateOperationsInput | string | null
    proposalOutcome?: NullableJsonNullValueInput | InputJsonValue
    ignoredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunEvalUpdateWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    evalName?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    pass?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunEvalUncheckedUpdateWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    evalName?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    pass?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunEvalUncheckedUpdateManyWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    evalName?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    pass?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentRunCreateManySessionInput = {
    id: string
    agentDefinitionId: string
    agentVersionId?: string | null
    status: string
    input: string
    finalOutput?: string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: number | null
    durationMs?: number | null
    error?: string | null
    triggeredBy: string
    meta: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentRunUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentDefinition?: AgentDefinitionUpdateOneRequiredWithoutRunsNestedInput
    steps?: RunStepUpdateManyWithoutRunNestedInput
    artifacts?: RunArtifactUpdateManyWithoutRunNestedInput
    evals?: RunEvalUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentDefinitionId?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    steps?: RunStepUncheckedUpdateManyWithoutRunNestedInput
    artifacts?: RunArtifactUncheckedUpdateManyWithoutRunNestedInput
    evals?: RunEvalUncheckedUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentDefinitionId?: StringFieldUpdateOperationsInput | string
    agentVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    finalOutput?: NullableStringFieldUpdateOperationsInput | string | null
    tokenUsage?: NullableJsonNullValueInput | InputJsonValue
    costEstimate?: NullableFloatFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    triggeredBy?: StringFieldUpdateOperationsInput | string
    meta?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}