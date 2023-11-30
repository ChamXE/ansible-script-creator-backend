const projectId = 'fyp';

exports.api = {
    port: 8080,
    secret: '',
    cookieExpire: 1000 * 60 * 60,
    allowOrigin: [],
};

exports.influx = {
    url: 'http://localhost:8086',
    bucket: projectId,
    org: '',
    token: '',
};

exports.mqtt = {
    host: 'localhost',
    topicPrefix: `${projectId}/`,
};

exports.postgres = {
    host: 'localhost',
    port: 5432,
    user: '',
    password: '',
    database: projectId,
};

exports.redis = {
    host: 'localhost',
    port: 6379,
    namespace: projectId,
};
