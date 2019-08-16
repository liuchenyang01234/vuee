//判断对象是否为空
import {isEmpty} from 'element-ui/src/utils/util'

export function isvalueEmpty (value) {
  return isEmpty(value)?'':value;
}
