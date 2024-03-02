import { useEffect, useState } from "react";
// 这个自定义Hook提供了一个非常便利的方式来与localStorage交互，确保了数据的持久化，同时也保持了React组件状态的响应性和同步。通过泛型的使用，它还提供了足够的灵活性来处理各种类型的数据。
/**
 * 自定义Hook，用于在React组件中管理和持久化状态到localStorage。
 *
 * 使用泛型`<T>`来支持不同类型的值，使得这个Hook可以用于存储各种类型的数据到localStorage中。
 * 当组件挂载时，它会尝试从localStorage中读取指定的键名对应的值。如果找到了值，它会更新状态为这个值。
 * 如果没有找到，状态会被设置为传递给Hook的`initialValue`。
 * 提供的`setValue`函数可以用于更新状态，并且同时将新的值保存到localStorage中。
 *
 * @template T 类型参数，指定存储和返回的值的类型。
 * @param {string} key localStorage中用于保存和检索数据的键名。
 * @param {T} initialValue 如果localStorage中没有找到对应的键，或者第一次使用这个键，那么使用这个初始值。
 * @returns {[T, (value: T) => void]} 返回一个数组，第一个元素是存储的值，第二个元素是一个函数，用于更新这个值并将其保存到localStorage中。
 */
const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  // eslint-disable-next-line no-unused-vars
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    // 从 localStorage 中获取
    const item = window.localStorage.getItem(key);
    if (item) {
      setStoredValue(JSON.parse(item));
    }
  }, [key]);
  const setValue = (value: T) => {
    // 存入 localStorage 并保存 state
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  return [storedValue, setValue];
};
export default useLocalStorage;
