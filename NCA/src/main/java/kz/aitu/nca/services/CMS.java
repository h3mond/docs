package kz.aitu.nca.services;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.Provider;
import java.security.Security;
import java.security.Signature;
import java.security.SignatureException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertStore;
import java.security.cert.CertStoreException;
import java.security.cert.CollectionCertStoreParameters;
import java.security.cert.X509Certificate;
import java.util.Collections;
import java.util.Enumeration;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.Base64;

import kz.gov.pki.kalkan.asn1.pkcs.PKCSObjectIdentifiers;
import kz.gov.pki.kalkan.jce.provider.KalkanProvider;
import kz.gov.pki.kalkan.jce.provider.cms.CMSException;
import kz.gov.pki.kalkan.jce.provider.cms.CMSProcessableByteArray;
import kz.gov.pki.kalkan.jce.provider.cms.CMSSignedData;
import kz.gov.pki.kalkan.jce.provider.cms.CMSSignedDataGenerator;

public class CMS {

  private KalkanProvider provider;
  static AtomicBoolean canWorkWithKalkan = new AtomicBoolean(false);
  static String providerName = "No_Name";
  static String kalkanErrorMessage = "";

  static { // #1
    try {
      Provider kalkanProvider = new KalkanProvider();
      //Добавление провайдера в java.security.Security
      boolean exists = false;
      Provider[] providers = Security.getProviders();
      for (Provider p : providers) {
        if (p.getName().equals(kalkanProvider.getName())) {
          exists = true;
        }
      }
      if (!exists) {
        Security.addProvider(kalkanProvider);
      } else {
        // да нужно заменять провайдер каждый раз когда загружаеться класс, иначе провайдер будет не доступен; 
        Security.removeProvider(kalkanProvider.getName());
        Security.addProvider(kalkanProvider);
      }
      canWorkWithKalkan.set(true);
      providerName = kalkanProvider.getName();
      // Почему Error, а не Exception - 
      // чтобы поймать например ошибки когда провайдер скомпилированный под яву 1.7 запускаетьс на  яве 1.6
    } catch (Error ex) {
      kalkanErrorMessage = ex.getMessage();
      canWorkWithKalkan.set(false);
    }
  }

  /**
   *
   *
   * @param raw
   * @return cms
 * @throws NoSuchProviderException
 * @throws InvalidAlgorithmParameterException
 * @throws CMSException
 * @throws CertStoreException
 * @throws InvalidKeyException
 * @throws SignatureException
 * @throws IOException
   */
  public String sign(byte[] raw, KeyStore p12, String password)
      throws KeyStoreException, UnrecoverableKeyException, NoSuchAlgorithmException, InvalidAlgorithmParameterException, NoSuchProviderException, CertStoreException, CMSException, InvalidKeyException, SignatureException, IOException
    {
      Enumeration<String> als = p12.aliases();
      String alias = null;
      while (als.hasMoreElements()) {
        alias = als.nextElement();
      }

      // get private key
      PrivateKey privateKey = (PrivateKey) p12.getKey(alias, password.toCharArray());

      // get certificate
      X509Certificate cert;
      cert = (X509Certificate) p12.getCertificate(alias);

      CMSSignedDataGenerator gen = new CMSSignedDataGenerator();

      Signature sig;
      sig = Signature.getInstance(cert.getSigAlgName(), Security.getProvider(providerName)); // kalkanprovider
      sig.initSign(privateKey);
      sig.update(raw);


      CMSProcessableByteArray cmsData = new CMSProcessableByteArray(raw);
      CertStore chainStore = CertStore.getInstance("Collection", new CollectionCertStoreParameters(Collections.singletonList(cert)), providerName);
      gen.addSigner(privateKey, cert, getDigestAlgorithmOidBYSignAlgorithmOid(cert.getSigAlgOID()));
      gen.addCertificatesAndCRLs(chainStore);

      CMSSignedData signed = gen.generate(cmsData, true, providerName);

      return new String(Base64.getEncoder().encode(signed.getEncoded()));
    }


  /**
   * Возвращает алгоритм хэширования по алгоритму подписи
   *
   * @param signOid sign OID
   * @return digest algorithm OID
   */
  public static String getDigestAlgorithmOidBYSignAlgorithmOid(String signOid) {
    if (signOid.equals(PKCSObjectIdentifiers.sha1WithRSAEncryption.getId())) {
      return CMSSignedDataGenerator.DIGEST_SHA1;
    }
    else if (signOid.equals(PKCSObjectIdentifiers.sha256WithRSAEncryption.getId())) {
      return CMSSignedDataGenerator.DIGEST_SHA256;
    }
    else {
      return CMSSignedDataGenerator.DIGEST_GOST34311_95;
    }
  }
}
