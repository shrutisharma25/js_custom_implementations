// This implementation simplifies the core of a promise:
//
// 1: State Management:
//      "pending": Initial state.
//      "fulfilled": When resolved.
//      "rejected": When rejected.
//
// 2: Handlers Array:
//      Stores .then() callbacks to run when resolved/rejected.
//
// 3: Resolve & Reject Functions:
//      Change state and execute stored handlers.
//
// 4: .then() Method:
//      If already resolved/rejected, execute the handler immediately.
//      Otherwise, store it to run later.
//
// 5: .catch() Method:
//      Just calls .then() with null for success.

function MyPromise(executor) {
  /*
   * Initial state of the promise.
   * - 'pending': The promise is still in progress.
   * - 'fulfilled': The promise was resolved successfully.
   * - 'rejected': The promise was rejected due to an error.
   */
  let state = 'pending';
  let value; // Stores the resolved or rejected value
  let handlers = []; // Stores functions to execute when resolved/rejected

  /*
   * Resolve function to fulfill the promise.
   * - Changes the state to 'fulfilled'.
   * - Stores the resolved value.
   * - Calls any stored handlers waiting for resolution.
   */
  function resolve(val) {
    if (state !== 'pending') return; // Ensure state change happens only once
    state = 'fulfilled';
    value = val;
    handlers.forEach((h) => h()); // Execute stored handlers
  }

  /*
   * Reject function to reject the promise.
   * - Changes the state to 'rejected'.
   * - Stores the rejection reason.
   * - Calls any stored handlers waiting for rejection.
   */
  function reject(err) {
    if (state !== 'pending') return; // Ensure state change happens only once
    state = 'rejected';
    value = err;
    handlers.forEach((h) => h()); // Execute stored handlers
  }

  // Execute the provided executor function with resolve and reject
  executor(resolve, reject);

  return {
    /*
     * Then method for chaining promise actions.
     * - If the promise is already fulfilled or rejected, execute the handler immediately.
     * - Otherwise, store the handler for execution once resolved or rejected.
     */
    then(onFulfilled, onRejected) {
      return MyPromise((resolve, reject) => {
        function handle() {
          try {
            if (state === 'fulfilled') {
              resolve(onFulfilled ? onFulfilled(value) : value);
            } else if (state === 'rejected') {
              reject(onRejected ? onRejected(value) : value);
            }
          } catch (error) {
            reject(error); // Catch any error in the handlers
          }
        }

        if (state === 'pending') {
          handlers.push(handle); // Store for later execution
        } else {
          handle(); // Execute immediately if already settled
        }
      });
    },

    /*
     * Catch method to handle errors.
     * - Equivalent to calling then(null, onRejected).
     */
    catch(onRejected) {
      return this.then(null, onRejected);
    },
  };
}

/*
 * Example usage:
 * - Creates a new promise that resolves after 1 second.
 * - Then logs the result or catches any errors.
 */
MyPromise((resolve) => setTimeout(() => resolve('Success!'), 1000))
  .then(console.log) // Logs 'Success!' after 1 second
  .catch(console.error); // Catches any errors (if any)
