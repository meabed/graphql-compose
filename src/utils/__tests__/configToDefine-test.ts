import { GraphQLInputObjectType, GraphQLObjectType, GraphQLString } from '../../graphql';
import { defineFieldMap, defineInputFieldMap } from '../configToDefine';

describe('configToDefine', () => {
  it('rejects a nullish argument config with its schema path', () => {
    const type = new GraphQLObjectType({ name: 'Output', fields: {} });

    expect(() =>
      defineFieldMap(type, {
        field: { type: GraphQLString, args: { arg: undefined as any } },
      })
    ).toThrow('Output.field(arg:) argument config must be an object');
  });

  it('rejects a nullish input field config with its schema path', () => {
    const type = new GraphQLInputObjectType({ name: 'Input', fields: {} });

    expect(() => defineInputFieldMap(type, { field: null as any })).toThrow(
      'Input.field field config must be an object'
    );
  });
});
