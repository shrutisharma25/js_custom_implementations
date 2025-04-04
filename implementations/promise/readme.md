# JavaScript Promises - Beginner's Guide

## Introduction

This README provides a detailed breakdown of how JavaScript Promises work, answering common questions with simple explanations and examples.

---

## **1️⃣ Why do we pass two parameters in `then(onFulfilled, onRejected)` when we only use one?**

### **Answer:**

- `then()` allows handling both success and failure.
- The first function (`onFulfilled`) runs if the promise resolves.
- The second function (`onRejected`) runs if the promise is rejected.
- If we don’t provide `onRejected`, errors are ignored unless caught with `.catch()`.

### **Example:**

```js
promise.then(
  (result) => console.log('Success:', result),
  (error) => console.log('Error:', error)
);
```

---

## **2️⃣ What does this line do?**

```js
resolve(onFulfilled ? onFulfilled(value) : value);
```

### **Answer:**

- If `onFulfilled` exists, we execute it with `value` and pass its result to `resolve()`.
- If `onFulfilled` is missing, we just pass `value` as is.

### **Example:**

```js
promise.then((value) => value + ' processed');
```

If `value` is "Data", the result becomes "Data processed".

---

## **3️⃣ Why do we create another promise inside `then()`?**

### **Answer:**

- We return a **new promise** to allow chaining.
- This ensures async tasks execute in sequence.

### **Example:**

```js
promise
  .then((result) => {
    return new MyPromise((resolve) => resolve(result + ' processed'));
  })
  .then((newResult) => console.log(newResult));
```

---

## **4️⃣ How does the `executor(resolve, reject)` function get called without being explicitly defined?**

### **Answer:**

- The `executor` function is **passed** when `MyPromise` is created.
- Inside `MyPromise`, we call `executor(resolve, reject)`, so it executes automatically.

### **Example:**

```js
MyPromise((resolve, reject) => {
  resolve('Done');
});
```

Even though `executor()` isn’t explicitly called, `MyPromise` calls it internally.

---

## **5️⃣ Why do we store handlers in an array instead of executing them immediately?**

### **Answer:**

- If the promise is **pending**, `.then()` is called before resolution.
- We store handlers to execute them **later** when resolved.

### **Example:**

```js
let promise = new MyPromise((resolve) => {
  setTimeout(() => resolve('Data'), 1000);
});

promise.then(console.log); // Runs AFTER 1 second
```

---

## **6️⃣ Why does `.catch()` call `.then(null, onRejected)`?**

### **Answer:**

- `.catch()` is shorthand for `.then(undefined, onRejected)`.
- It enables separate error handling.

### **Example:**

```js
promise.catch((error) => console.log('Error caught:', error));
```

This is equivalent to:

```js
promise.then(null, (error) => console.log('Error caught:', error));
```

---

## **7️⃣ How does this code execute step-by-step?**

```js
let promise = MyPromise((resolve) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

promise.then(console.log);
promise.catch(console.log);
```

### **Execution Flow:**

1. `MyPromise` is called, `setTimeout()` starts but hasn’t resolved yet.
2. `.then(console.log)` is called, but since the promise is pending, the callback is stored.
3. `.catch(console.log)` is called, but since there’s no rejection, it does nothing.
4. After 1 second, `resolve("Success!")` is called.
5. The stored `.then(console.log)` executes, logging **"Success!"**.

---

## **🔟 Common Interview Questions on JavaScript Promises (With Answers and Examples)**

### **Basic Questions:**

1. **What is a Promise in JavaScript?**

   - A Promise is an object representing an asynchronous operation.
   - It can be **pending**, **fulfilled**, or **rejected**.

   **Example:**

   ```js
   let promise = new Promise((resolve, reject) => {
     setTimeout(() => resolve('Done!'), 1000);
   });
   ```

2. **How do you create a Promise?**

   ```js
   let myPromise = new Promise((resolve, reject) => {
     if (true) resolve('Success');
     else reject('Failure');
   });
   ```

3. **What are the three states of a Promise?**

   - Pending
   - Fulfilled
   - Rejected

4. **What happens when a Promise is resolved or rejected?**

   - When resolved, `.then()` executes.
   - When rejected, `.catch()` executes.

5. **How does `.then()` work in Promises?**
   - It registers callbacks for resolution and rejection.

### **Intermediate Questions:**

6. **Difference between `.then()` and `.catch()`?**

   - `.then(success, failure)` handles both cases.
   - `.catch()` only handles rejection.

7. **How does `executor(resolve, reject)` work?**

   - It's called immediately when creating a Promise.

8. **Why do we pass two parameters (`onFulfilled`, `onRejected`) in `.then()`?**

   - To handle both success and failure cases.

9. **What happens if you call `.then()` multiple times on the same Promise?**

   - All `.then()` callbacks execute in order of registration.

10. **How does error handling work in Promises?**
    - Errors propagate down `.then()` unless caught by `.catch()`.

### **Advanced Questions:**

11. **Why return a new Promise inside `.then()`?**

    - For chaining operations.

12. **What is Promise chaining, and why is it useful?**

    - It allows sequential execution of async tasks.

13. **What happens if a Promise is neither resolved nor rejected?**

    - It remains pending forever.

14. **How can we convert a callback-based function into a Promise?**

    ```js
    function asyncFunction() {
      return new Promise((resolve) => {
        setTimeout(() => resolve('Done'), 1000);
      });
    }
    ```

15. **What is `Promise.all()`?**

    - Resolves when all promises resolve.

16. **What is `Promise.race()`?**

    - Resolves/rejects as soon as one Promise settles.

17. **Difference between `async/await` and Promises?**

    - `async/await` is a cleaner syntax for handling Promises.

18. **What happens if an error occurs inside `.then()`?**

    - It skips to the next `.catch()`.

19. **Why are Promises useful compared to callbacks?**

    - They avoid **callback hell** and improve readability.

20. **How can we cancel a Promise?**
    - Use an external flag or `AbortController`.

---

## **📌 Summary**

This guide should help you understand JavaScript Promises clearly! 🚀
