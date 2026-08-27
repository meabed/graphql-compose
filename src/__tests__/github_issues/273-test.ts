import { buildSchema } from 'graphql';
import { SchemaComposer, dedent, graphqlVersion } from '../..';

describe('github issue #273: Object directives are removed from schema', () => {
  it('should keep @test directive on TestObject', () => {
    if (graphqlVersion < 15) {
      return;
    }

    const schema = buildSchema(`
      directive @test on OBJECT | INPUT_OBJECT | SCALAR | ENUM
      
      type ModifyMe @test {
        id: ID!
      }

      input Input @test {
        id: ID!
      }

      scalar Scalar @test

      enum Enum @test

      type Query {
        hello(a: Input, s: Scalar, e: Enum): ModifyMe
      }
    `);

    const sc = new SchemaComposer(schema);

    const sdl = sc.toSDL({
      exclude: ['ID', 'String', 'Int', 'Boolean', 'Float'],
      omitDescriptions: true,
    });

    if (graphqlVersion >= 17) {
      expect(sdl).toContain('directive @oneOf on INPUT_OBJECT');
    }
    expect(sdl.replace('\n\ndirective @oneOf on INPUT_OBJECT', '')).toBe(dedent`
      directive @test on OBJECT | INPUT_OBJECT | SCALAR | ENUM

      directive @specifiedBy(
        url: String!
      ) on SCALAR

      type Query {
        hello(a: Input, s: Scalar, e: Enum): ModifyMe
      }

      scalar Scalar @test

      enum Enum @test

      type ModifyMe @test {
        id: ID!
      }

      input Input @test {
        id: ID!
      }
    `);
  });
});
