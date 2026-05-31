//
// Bridging header.
//
// Forward-declare NativeComposeThreadedRuntime's `ThreadedRuntime` ObjC class so
// Swift can call +configure WITHOUT `import NativeComposeThreadedRuntime` (which
// would pull Nitro's C++ umbrella into the Swift importer). The real class links
// from the pod at link time.
#import <Foundation/Foundation.h>

@interface ThreadedRuntime : NSObject
+ (void)configureWithReactNativeDelegate:(id)delegate
                           launchOptions:(nullable NSDictionary *)launchOptions;
@end
