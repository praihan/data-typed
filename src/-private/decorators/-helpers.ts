import { ModelMeta, META_KEY } from '../model';
import { Constructor } from '../types';

export function getModelMeta(target: Constructor): ModelMeta {
  let meta = (target as any)[META_KEY] as ModelMeta;
  if (meta != null && !(meta instanceof ModelMeta)) {
    throw TypeError(`The key for model metadata (${META_KEY}) on ${target.name} is already taken.`);
  }
  if (meta == null) {
    meta = (target as any)[META_KEY] = new ModelMeta(target);
  }
  return meta;
}

export function getModelMetaUnchecked(target: Constructor): ModelMeta {
  return (target as any)[META_KEY] as ModelMeta;
}
