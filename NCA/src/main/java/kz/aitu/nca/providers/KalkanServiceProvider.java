package kz.aitu.nca.providers;

import java.security.Security;

import kz.gov.pki.kalkan.jce.provider.KalkanProvider;
import kz.gov.pki.kalkan.xmldsig.KncaXS;

public class KalkanServiceProvider {

  private final KalkanProvider provider;

  public KalkanServiceProvider() {
    System.out.println("Initializing Kalkan...");
    provider = new KalkanProvider();
    Security.addProvider(provider);
    KncaXS.loadXMLSecurity();
    System.out.println("Kalkan was initialized. Version: " + getVersion());
  }


  public String getVersion() {
    return KalkanProvider.class.getPackage().getImplementationVersion();
  }


}
