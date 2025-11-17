# REFACTORING NOTES

---

## ISSUE 1: Duplicate and inconsistent interface definitions

### Original Code:

Two different versions of `WalletBalance` and `FormattedWalletBalance`
existed in the same file:

### Problems:

1.  The file had two conflicting versions of `WalletBalance`.
2.  A second version was missing the `blockchain` field, causing
    TypeScript inconsistency.
3.  `FormattedWalletBalance` was introduced unnecessarily and used
    incorrectly later.

### Fixed Code:

```ts
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
```

`FormattedWalletBalance` was removed entirely because formatting is
handled inline.

---

## ISSUE 2: Incorrect filter logic and undefined variable

### Original Code:

```ts
return balances.filter((balance: WalletBalance) => {
  const balancePriority = getPriority(balance.blockchain);
  if (lhsPriority > -99) {
    if (balance.amount <= 0) {
      return true;
    }
  }
  return false;
});
```

### Problems:

1.  `lhsPriority` is undefined --- should be `balancePriority`.
2.  Filter logic is inverted --- returns balances with amount ≤ 0.
3.  Logic should instead:
    - Keep balances with supported priority.
    - Keep balances with amount \> 0.

### Fixed Code:

```ts
const filteredBalances = balances.filter((balance: WalletBalance) => {
  const priority = getPriority(balance.blockchain);
  return priority > -99 && balance.amount > 0;
});
```

---

## ISSUE 3: Incorrect useMemo dependencies

### Original Code:

```ts
}, [balances, prices]);
```

### Problems:

- `prices` is not used inside the memoized calculation.
- Including it causes unnecessary recomputation whenever token prices
  update.

### Fixed Code:

```ts
}, [balances]);
```

---

## ISSUE 4: Unused and redundant formattedBalances array

### Original Code:

```ts
const formattedBalances = sortedBalances.map((balance: WalletBalance) => ({
  ...balance,
  formatted: balance.amount.toFixed(),
}));
```

### Problems:

1.  `formattedBalances` was never used.
2.  A second loop immediately re-mapped `sortedBalances`, wasting CPU
    cycles.
3.  Introduced a new interface that added no value.

### Fixed Code:

Removed entirely. Formatting is now done inline:

```ts
formattedAmount={balance.amount.toFixed()}
```

---

## ISSUE 5: Incorrect types and misleading variable naming

### Original Code:

```ts
const rows = sortedBalances.map(
  (balance: FormattedWalletBalance, index: number) => {}
);
```

### Problems:

1.  `sortedBalances` contains `WalletBalance`, not
    `FormattedWalletBalance`.
2.  Code incorrectly assumes `balance.formatted` exists.
3.  Variable name `sortedBalances` was misleading because filtering was
    also applied.

### Fixed Code:

```ts
const sortedAndFilteredBalances = useMemo(() => { ... }, [balances]);

const rows = sortedAndFilteredBalances.map((balance: WalletBalance) => { ... });
```

---

## ISSUE 6: Using array index as React key (React anti-pattern)

### Original Code:

```tsx
<WalletRow key={index} ... />
```

### Problem:

Using indexes as keys causes unstable rendering when sorting is
involved.

### Fixed Code:

```tsx
<WalletRow key={balance.currency} ... />
```

---

## ISSUE 7: Missing return for equal priority in `.sort()`

### Original Code:

```ts
.sort((lhs, rhs) => {
  if (leftPriority > rightPriority) return -1;
  else if (rightPriority > leftPriority) return 1;
});
```

### Problem:

- When priorities are equal, the comparator returns `undefined`,
  leading to unstable sorting.

### Fixed Code:

```ts
return filteredBalances.sort((lhs, rhs) => {
  const left = getPriority(lhs.blockchain);
  const right = getPriority(rhs.blockchain);

  if (left > right) return -1;
  if (right > left) return 1;
  return 0;
});
```

---

## ISSUE 8: getPriority defined inside component

### Original Code:

```ts
const getPriority = (blockchain: any) => { ... };
```

### Problems:

1.  Recreated on every render → unnecessary re-renders.
2.  The parameter uses `any` type.

### Fixed Code:

Moved outside component and strongly typed:

```ts
const getPriority = (blockchain: string): number => { ... };
```

---

## ISSUE 9: Unused `children` destructuring

### Original Code:

```ts
const { children, ...rest } = props;
```

### Problem:

- `children` is never used → unnecessary destructuring.

### Fixed Code:

```ts
const { ...rest } = props;
```
