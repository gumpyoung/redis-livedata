// XXX We should revisit how we factor MongoDB support into (1) the
// server-side node.js driver [which you might use independently of
// livedata, after all], (2) minimongo [ditto], and (3) Collection,
// which is the class that glues the two of them to Livedata, but also
// is generally the "public interface for newbies" to Mongo in the
// Meteor universe. We want to allow the components to be used
// independently, but we don't want to overwhelm the user with
// minutiae.

Package.describe({
  summary: "Adaptor for using Redis and Miniredis over DDP",
  version: "1.0.2",
  name: "gumpyoung:redis-livedata",
  git: "https://github.com/meteor/redis-livedata"
});

Npm.depends({
  redis: "0.10.3"
});

Package.on_use(function (api) {
  api.versionsFrom('0.9.2.2');
  api.use(['random', 'ejson', 'json', 'underscore', 'logging', 'check',
           'livedata', 'tracker', 'id-map'],
          ['client', 'server']);

  api.use('slava:miniredis@1.0.0', ['client', 'server']);

  // Binary Heap data structure is used to optimize oplog observe driver
  // performance.
  api.use('binary-heap', 'server');

  // Allow us to detect 'insecure'.
  api.use('insecure', {weak: true});

  // Allow us to detect 'autopublish', and publish collections if it's loaded.
  api.use('autopublish', 'server', {weak: true});

  // Allow us to detect 'disable-oplog', which turns off oplog tailing for your
  // app even if it's configured in the environment. (This package will be
  // probably be removed before 1.0.)
//  api.use('disable-oplog', 'server', {weak: true});

  // defaultRemoteCollectionDriver gets its deployConfig from something that is
  // (for questionable reasons) initialized by the webapp package.
  api.use('webapp', 'server', {weak: true});

  // If the facts package is loaded, publish some statistics.
  api.use('facts', 'server', {weak: true});

  api.use('callback-hook', 'server');

  // Stuff that should be exposed via a real API, but we haven't yet.
  api.export('RedisInternals', 'server');
  // For tests only.
  api.export('RedisTest', 'server', {testOnly: true});

  api.add_files('sync_map.js', ['client', 'server']);
  api.add_files('redis_commands.js', ['client', 'server']);
  api.add_files(['redis_driver.js', 'oplog_tailing.js',
                 'observe_multiplex.js', 'doc_fetcher.js',
                 'keyspace_notification_observe_driver.js',
                 'redis_client.js',
                 'redis_watcher.js'],
                'server');
  api.add_files('local_collection_driver.js', ['client', 'server']);
  api.add_files('remote_collection_driver.js', 'server');
  api.add_files('redis_collection.js', ['client', 'server']);
});

Package.on_test(function (api) {
  api.use('slava:redis-livedata');
  api.use('check');
  api.use(['tinytest', 'underscore', 'test-helpers', 'ejson', 'random',
           'livedata']);
  // XXX test order dependency: the allow_tests "partial allow" test
  // fails if it is run before redis_livedata_tests.
  api.add_files('redis_livedata_tests.js', ['client', 'server']);
  api.add_files('allow_tests.js', ['client', 'server']);
  //api.add_files('redis_collection_tests.js', ['client', 'server']);
  //api.add_files('observe_changes_tests.js', ['client', 'server']);
  //api.add_files('oplog_tests.js', 'server');
  //api.add_files('doc_fetcher_tests.js', 'server');
});
