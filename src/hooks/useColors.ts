export default function useColors() {
  function getAmountColor(amount: number) {
    return !amount ? "gray" : amount > 0 ? "green" : "red";
  }

  return { getAmountColor };
}
