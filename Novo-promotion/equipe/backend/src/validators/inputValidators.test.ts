import assert from "node:assert/strict";
import { test } from "node:test";
import { PostInputValidator } from "./PostInputValidator";
import { UserInputValidator } from "./UserInputValidator";

test("valida ids positivos inteiros", () => {
  assert.equal(UserInputValidator.parseId("12"), 12);
  assert.equal(PostInputValidator.parseId("0"), undefined);
  assert.equal(PostInputValidator.parseId("1.5"), undefined);
});

test("valida e normaliza dados de usuário", () => {
  assert.deepEqual(UserInputValidator.parseCreate({
    email: "cliente@example.com",
    name: null,
  }), {
    email: "cliente@example.com",
    name: null,
  });
  assert.equal(UserInputValidator.parseCreate({ email: "inválido" }), undefined);
  assert.deepEqual(UserInputValidator.parseUpdate({ name: "Cliente" }), {
    name: "Cliente",
  });
  assert.equal(UserInputValidator.parseUpdate({}), undefined);
});

test("valida e normaliza dados de publicação", () => {
  assert.deepEqual(PostInputValidator.parseCreate({
    title: "  Oferta  ",
    authorId: 4,
    content: null,
  }), {
    title: "Oferta",
    authorId: 4,
    content: null,
  });
  assert.equal(PostInputValidator.parseCreate({
    title: "Oferta",
    authorId: 0,
  }), undefined);
  assert.deepEqual(PostInputValidator.parseUpdate({ title: "  Atualizada " }), {
    title: "Atualizada",
  });
  assert.equal(PostInputValidator.parseUpdate({ published: "sim" }), undefined);
});
